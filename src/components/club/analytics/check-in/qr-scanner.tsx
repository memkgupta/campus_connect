"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Scan } from "lucide-react";

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="aspect-square flex items-center justify-center bg-slate-800 border-yellow-500/20">
        {!isScanning ? (
          <div className="text-center space-y-4">
            <Scan className="w-16 h-16 text-yellow-500 mx-auto" />
            <p className="text-slate-400">Click to start scanning</p>
          </div>
        ) : (
          <div className="w-full h-full bg-black">
            {/* QR Scanner implementation will go here */}
          </div>
        )}
      </Card>
      
      <p className="text-sm text-slate-400 text-center">
        Position the QR code within the frame to scan
      </p>
    </div>
  );
}