#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h> 

// Definisikan Pin Kontrol
#define RELAY_PIN_KANAN 18 // Pin D18 untuk mengaktifkan KANAN
#define RELAY_PIN_KIRI 5   // Pin D5 untuk mengaktifkan KIRI
#define PIN_ENA 14      // GPIO 17 (Kecepatan/Enable) <--- Pin PWM

// Definisikan Pin Stopper (Limit Switch)
#define STOPPER_PIN_KIRI 16 // Pin RX2
#define STOPPER_PIN_KANAN 4 // Pin D4
// #define STOPPER_PIN_KANAN 16 // Pin D23
#define PINECHO 13
#define PINTRIGER 12

// --- KONFIGURASI PWM ---
const int freq = 5000;      // Frekuensi PWM (5 kHz)
const int ledChannel = 0;   // Pilih channel PWM (0-15)
const int resolution = 8;   // Resolusi PWM (8-bit: 0-255)

// Nilai PWM untuk 50% Kecepatan: (2^8 - 1) * 0.5 = 255 * 0.5 = 127
const int SPEED_50_PERCENT = 127; 
const int SPEED_FULL = 255;
const int SPEED_STOP = 0;





// Ganti dengan kredensial Wi-Fi Anda
const char* ssid = "Tikaory23";
const char* password = "tika2306";

int RANGEMAX = 10; //Untuk maksimal jarak atau range
int RANGEMIN = 00; //Untuk minimal jarak atau range
long DURATION, DISTANCE;
volatile long currentDistance = 0;

WebServer server(80);

//IP API
const char* serverApi = "http://192.168.43.134/firegars/C_device/update_ip"; 
const char* DEVICE_ID = "ARDUINO_001"; 

// Asumsi: Relai diaktifkan dengan logika LOW, dan Stopper Normally Closed (NC)
// Sesuaikan Logika HIGH/LOW ini sesuai sirkuit Anda
#define RELAY_ON LOW
#define RELAY_OFF HIGH
#define STOPPER_ACTIVE LOW // Jika stopper ditarik ke GND saat ditekan

// Fungsi untuk mengatur kecepatan motor
void setMotorSpeed(int speedValue) {
  ledcWrite(PIN_ENA, speedValue);
}
void stopMotor() {
  // Matikan kedua relai untuk menghentikan motor
  digitalWrite(RELAY_PIN_KANAN, RELAY_OFF);
  digitalWrite(RELAY_PIN_KIRI, RELAY_OFF);
  setMotorSpeed(SPEED_STOP);
}

void moveAndMonitor(int moveRelayPin, int stopStopperPin, const char* direction) {
  stopMotor(); // Pastikan motor berhenti sebelum memulai

  // Cek apakah motor sudah berada di posisi tujuan
  if (digitalRead(stopStopperPin) == STOPPER_ACTIVE) {
    server.send(200, "text/plain", "Motor sudah di posisi " + String(direction) + ".");
    return;
  }
  // Tentukan pin arah yang berlawanan untuk dimatikan
  int oppositePin = (moveRelayPin == RELAY_PIN_KANAN) ? RELAY_PIN_KIRI : RELAY_PIN_KANAN;
  setMotorSpeed(SPEED_50_PERCENT); 

  // Nyalakan Relai untuk bergerak
  digitalWrite(oppositePin, RELAY_OFF);
  digitalWrite(moveRelayPin, RELAY_ON);

  // Monitor Stopper
  long startTime = millis();
  const long TIMEOUT = 2000; // Timeout 1 detik

  while (digitalRead(stopStopperPin) != STOPPER_ACTIVE) {
    // Jalankan WebServer secara periodik agar tidak hang
    server.handleClient();
    
    // Cek Timeout
    if (millis() - startTime > TIMEOUT) {
      stopMotor();
      server.send(500, "text/plain", "Error: Timeout! Motor gagal mencapai " + String(direction) + ".");
      return;
    }
    delay(50); // Jeda singkat
  }

  // Stopper telah aktif, matikan motor
  stopMotor();
  server.send(200, "text/plain", "Motor berhasil bergerak ke " + String(direction) + ".");
}

void handleKanan() {
  // Gerakkan ke KANAN: Nyalakan RELAY_PIN_KANAN, pantau STOPPER_PIN_KANAN
  moveAndMonitor(RELAY_PIN_KANAN, STOPPER_PIN_KANAN, "KANAN");
}

void handleKiri() {
  // Gerakkan ke KIRI: Nyalakan RELAY_PIN_KIRI, pantau STOPPER_PIN_KIRI
  moveAndMonitor(RELAY_PIN_KIRI, STOPPER_PIN_KIRI, "KIRI");
}

void handleStatus() {
  // Baca status pin relai dan stopper
  int relayKananStatus = digitalRead(RELAY_PIN_KANAN);
  int relayKiriStatus = digitalRead(RELAY_PIN_KIRI);
  int stopperKananStatus = digitalRead(STOPPER_PIN_KANAN);
  int stopperKiriStatus = digitalRead(STOPPER_PIN_KIRI);

  // Tentukan apakah motor sedang bergerak (ON) atau diam (OFF)
  // Motor ON jika salah satu relai AKTIF (RELAY_ON, diasumsikan LOW)
  bool isMoving = (relayKananStatus == RELAY_ON || relayKiriStatus == RELAY_ON);

  // Buat String JSON untuk respons
  String json = "{";
  json += "\"motor_status\": \"" + String(isMoving ? "MOVING" : "IDLE") + "\",";
  json += "\"relay_kanan\": " + String(relayKananStatus == RELAY_ON ? "true" : "false") + ",";
  json += "\"relay_kiri\": " + String(relayKiriStatus == RELAY_ON ? "true" : "false") + ",";
  json += "\"posisi_kanan\": " + String(stopperKananStatus == STOPPER_ACTIVE ? "true" : "false") + ",";
  json += "\"posisi_kiri\": " + String(stopperKiriStatus == STOPPER_ACTIVE ? "true" : "false");
  json += "}";

  // Kirim respons JSON
  server.send(200, "application/json", json);
}

void setupWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.print("IP: ");
  String currentIP = WiFi.localIP().toString();
  Serial.println(WiFi.localIP()); // Catat IP ini!
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverApi);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Body POST request, sesuai dengan kebutuhan CI3:
    String postData = "device_id=";
    postData += DEVICE_ID;
    postData += "&ip_address=";
    postData += currentIP;

    Serial.println("Mengirim IP ke Server...");
    
    // Kirim HTTP POST request
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      Serial.print("Kode Response HTTP: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.print("Respon Server: ");
      Serial.println(response);
    } else {
      Serial.print("Error saat mengirim POST request. Kode: ");
      Serial.println(httpResponseCode);
    }
    
    http.end(); // Tutup koneksi HTTP
  }
}

void setupPins() {
  // Setup Pin Relai (Output)
  pinMode(RELAY_PIN_KANAN, OUTPUT);
  pinMode(RELAY_PIN_KIRI, OUTPUT);
  stopMotor(); // Pastikan mati saat startup

   // --- KONFIGURASI PWM (PIN ENA) ---
  // Konfigurasi channel, frekuensi, dan resolusi
  // ledcSetup(ledChannel, freq, resolution);
  // Attach channel ke pin ENA
  // ledcAttachPin(PIN_ENA, ledChannel);

  //update yg terbaru
  ledcAttach(PIN_ENA, freq, resolution);

  // Setup Pin Stopper (Input dengan Pull-up internal)
  // Pull-up internal akan menarik pin HIGH jika stopper tidak ditekan
  pinMode(STOPPER_PIN_KIRI, INPUT_PULLUP); 
  pinMode(STOPPER_PIN_KANAN, INPUT_PULLUP);

  pinMode(PINTRIGER, OUTPUT);
  pinMode(PINECHO, INPUT);
}

void setup() {
  Serial.begin(115200);
  setupPins();
  setupWifi();

  // Definisikan Endpoint API
  server.on("/servo/kanan", HTTP_GET, handleKanan);
  server.on("/servo/kiri", HTTP_GET, handleKiri);
  server.on("/status", HTTP_GET, handleStatus);
  
  server.begin();
}

void loop() {
  server.handleClient(); 
  digitalWrite(PINTRIGER, LOW);delayMicroseconds(2);
  digitalWrite(PINTRIGER, HIGH);delayMicroseconds(10);
  digitalWrite(PINTRIGER, LOW);
  DURATION = pulseIn(PINECHO, HIGH);

 //hitungan untuk dijadikan sebuah jarak
  DISTANCE = DURATION/60;
  currentDistance = DURATION / 58;
 
 //menambahkan funsi penulisan benda tidak terjangkau apabila melebihi batas jarak yang di tentukan
  if (DISTANCE>= RANGEMAX || DISTANCE <= RANGEMIN)
  {
    delay(1000);
    Serial.print("Kendaraan tidak terdeteksi:");
    Serial.println(DISTANCE);
    Serial.println(currentDistance);
    delay(1000);
  }
  else 
  {
 //mengirimkan info jarak ke komputer melalui serial monitor
  Serial.println(DISTANCE);
  Serial.println(currentDistance);
//delay sebagai jeda untuk proses looping
  delay(1000);
  }
}