#include <WiFi.h>
#include <WebServer.h>

// --- PIN KONTROL ---
// PIN L298N untuk Motor DC
#define PIN_IN1 18      // GPIO 18 (Arah 1 - Kanan)
#define PIN_IN2 5       // GPIO 5  (Arah 2 - Kiri)
#define PIN_ENA 17      // GPIO 17 (Kecepatan/Enable) <--- Pin PWM

// Pin Stopper (Limit Switch)
#define STOPPER_PIN_KIRI 16 // Pin RX2
#define STOPPER_PIN_KANAN 4 // Pin D4 (Ganti jika konflik)

// --- KONFIGURASI WIFI ---
const char* ssid = "Tikaory23";
const char* password = "tika2306";

// --- KONFIGURASI PWM ---
const int freq = 5000;      // Frekuensi PWM (5 kHz)
const int ledChannel = 0;   // Pilih channel PWM (0-15)
const int resolution = 8;   // Resolusi PWM (8-bit: 0-255)

// Nilai PWM untuk 50% Kecepatan: (2^8 - 1) * 0.5 = 255 * 0.5 = 127
const int SPEED_50_PERCENT = 127; 
const int SPEED_FULL = 255;
const int SPEED_STOP = 0;

// --- LOGIKA KONTROL ---
#define RELAY_ON LOW
#define RELAY_OFF HIGH
#define STOPPER_ACTIVE LOW 

WebServer server(80);

// --- PROTOTYPE FUNGSI (Untuk dipanggil sebelum didefinisikan) ---
void setupWifi();
void setupPins();
void stopMotor();

// Fungsi untuk mengatur kecepatan motor
void setMotorSpeed(int speedValue) {
  ledcWrite(ledChannel, speedValue);
}

void stopMotor() {
  // Matikan kedua pin arah
  digitalWrite(PIN_IN1, RELAY_OFF);
  digitalWrite(PIN_IN2, RELAY_OFF);
  // Atur kecepatan ke 0 (Berhenti)
  setMotorSpeed(SPEED_STOP);
}

void moveAndMonitor(int movePin, int stopStopperPin, const char* direction) {
    stopMotor(); // Pastikan motor berhenti sebelum memulai

    if (digitalRead(stopStopperPin) == STOPPER_ACTIVE) {
        server.send(200, "text/plain", "Motor sudah di posisi " + String(direction) + ".");
        return;
    }

    // Tentukan pin arah yang berlawanan untuk dimatikan
    int oppositePin = (movePin == PIN_IN1) ? PIN_IN2 : PIN_IN1;
    
    // 1. Atur Kecepatan (50% seperti yang diminta)
    setMotorSpeed(SPEED_50_PERCENT); 
    
    // 2. Tentukan Arah
    digitalWrite(oppositePin, RELAY_OFF);
    digitalWrite(movePin, RELAY_ON);

    // ... (Logika Monitoring Stopper dan Timeout tetap sama) ...
    long startTime = millis();
    const long TIMEOUT = 5000; // Tingkatkan Timeout menjadi 5 detik

    while (digitalRead(stopStopperPin) != STOPPER_ACTIVE) {
        server.handleClient();
        
        // Cek Timeout
        if (millis() - startTime > TIMEOUT) {
            stopMotor();
            server.send(500, "text/plain", "Error: Timeout! Motor gagal mencapai " + String(direction) + ".");
            return;
        }
        delay(50);
    }

    // Stopper telah aktif, matikan motor
    stopMotor();
    server.send(200, "text/plain", "Motor berhasil bergerak ke " + String(direction) + ".");
}


void handleKanan() {
    // Gerakkan ke KANAN: PIN_IN1 (D18)
    moveAndMonitor(PIN_IN1, STOPPER_PIN_KANAN, "KANAN");
}

void handleKiri() {
    // Gerakkan ke KIRI: PIN_IN2 (D5)
    moveAndMonitor(PIN_IN2, STOPPER_PIN_KIRI, "KIRI");
}

// ... (Fungsi handleStatus, setupWifi, setupPins lainnya tetap sama) ...
// NOTE: Saya menghapus kode sensor ultrasonik untuk fokus pada PWM/L298N, 
// Anda bisa menambahkannya kembali jika sudah berfungsi.

void setupWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.print("IP: ");
  Serial.println(WiFi.localIP()); 
}

void setupPins() {
  // --- KONFIGURASI PIN L298N (IN1 & IN2 sebagai output) ---
  pinMode(PIN_IN1, OUTPUT);
  pinMode(PIN_IN2, OUTPUT);
  stopMotor(); // Pastikan mati saat startup

  // --- KONFIGURASI PWM (PIN ENA) ---
  // Konfigurasi channel, frekuensi, dan resolusi
  ledcSetup(ledChannel, freq, resolution);
  // Attach channel ke pin ENA
  ledcAttachPin(PIN_ENA, ledChannel);

  // --- KONFIGURASI PIN STOPPER ---
  pinMode(STOPPER_PIN_KIRI, INPUT_PULLUP); 
  pinMode(STOPPER_PIN_KANAN, INPUT_PULLUP);
}

void setup() {
  Serial.begin(115200);
  setupPins();
  setupWifi();

  // Definisikan Endpoint API
  server.on("/servo/kanan", HTTP_GET, handleKanan);
  server.on("/servo/kiri", HTTP_GET, handleKiri);
  // server.on("/status", HTTP_GET, handleStatus); // Tambahkan jika sudah ada
  
  server.begin();
}

void loop() {
  server.handleClient(); 
}