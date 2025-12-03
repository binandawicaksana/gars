#include <WiFi.h>
#include <HTTPClient.h> // Library untuk HTTP requests

// Ganti dengan kredensial Wi-Fi Anda
const char* ssid = "NAMA_WIFI_ANDA";
const char* password = "PASSWORD_WIFI_ANDA";

// Ganti dengan URL endpoint CodeIgniter Anda
// Pastikan CodeIgniter Anda dapat diakses oleh jaringan lokal ESP32!
const char* serverApi = "http://IP_SERVER_LOKAL_ANDA/index.php/device/update_ip"; 

// ID unik untuk alat ini. PENTING: Ganti ini untuk setiap alat!
const char* DEVICE_ID = "ARDUINO_001"; 

void setup() {
  Serial.begin(115200);
  delay(1000); 

  // --- 1. Koneksi Wi-Fi ---
  Serial.print("Menghubungkan ke ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nKoneksi Wi-Fi berhasil!");
  String currentIP = WiFi.localIP().toString();
  Serial.print("IP Address Lokal: ");
  Serial.println(currentIP);

  // --- 2. Update IP ke Server ---
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

void loop() {
  // Loop bisa dibiarkan kosong karena update IP hanya perlu dilakukan saat boot (setup)
  // Anda bisa menambahkan pengecekan koneksi di sini jika diperlukan.
}