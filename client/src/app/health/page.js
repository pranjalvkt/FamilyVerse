"use client";

import { useEffect, useState } from "react";

export default function HealthCheckPage() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold">API Health Check</h1>
      <p className="mt-4 text-lg">Status: <strong>{status}</strong></p>
    </main>
  );
}
