// Test file to verify backend connectivity
// You can run this in the browser console to test

console.log("🧪 Testing backend connectivity...");

const testBackendConnection = async () => {
  try {
    console.log(
      "🔗 Testing connection to: http://localhost:4000/api/v1/auth/login"
    );
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: "test@example.com",
        password: "testpassword",
      }),
    });

    console.log("📡 Backend response status:", response.status);
    const data = await response.json();
    console.log("📥 Backend response data:", data);
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
  }
};

// Test basic connectivity to the server
const testServerHealth = async () => {
  try {
    console.log("🏥 Testing server health at: http://localhost:4000");
    const response = await fetch("http://localhost:4000");
    console.log("💓 Server health check status:", response.status);
    const text = await response.text();
    console.log("💓 Server response:", text);
  } catch (error) {
    console.error("❌ Server health check failed:", error);
  }
};

// Auto-run tests
testServerHealth();
testBackendConnection();
