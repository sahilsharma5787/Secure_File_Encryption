import { useState } from "react";
import { Card } from "@/components/ui/card";
import EncryptPanel from "@/components/EncryptPanel";
import DecryptPanel from "@/components/DecryptPanel";
import EncryptResultPanel from "@/components/EncryptResultPanel";
import DecryptResultPanel from "@/components/DecryptResultPanel";
import ProcessingPanel from "@/components/ProcessingPanel";
import ErrorPanel from "@/components/ErrorPanel";
import SecurityInfo from "@/components/SecurityInfo";
import { useTabs } from "@/hooks/use-tabs";
import { Shield, LockOpen } from "lucide-react";
import { useParams } from "wouter";

// Types for file data
export type FileData = {
  file: File;
  password: string;
};

export type EncryptedFileData = {
  id: string;
  fileName: string;
  originalFileName: string;
  originalSize: number;
  downloadUrl: string;
  decryptLink: string;
};

export type DecryptedFileData = {
  fileName: string;
  fileSize: number;
  downloadUrl: string;
};

export type ErrorData = {
  title: string;
  message: string;
  details?: string;
};

// Panel types for state management
export type Panel = 
  | "encrypt" 
  | "decrypt" 
  | "encryptResult" 
  | "decryptResult" 
  | "processing" 
  | "error";

export default function Home() {
  // Get URL parameters for direct decryption
  const params = useParams();
  
  // Tab state
  const { activeTab, setActiveTab } = useTabs(
    params.id ? "decrypt" : "encrypt", 
    ["encrypt", "decrypt"]
  );
  
  // Panel state
  const [activePanel, setActivePanel] = useState<Panel>(
    params.id ? "decrypt" : "encrypt"
  );

  // File data states
  const [encryptFileData, setEncryptFileData] = useState<FileData | null>(null);
  const [decryptFileData, setDecryptFileData] = useState<FileData | null>(null);
  const [encryptedResult, setEncryptedResult] = useState<EncryptedFileData | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<DecryptedFileData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [processingText, setProcessingText] = useState({
    title: "Processing Your File",
    message: "Please wait while we process your file..."
  });

  const handleEncryptSubmit = (data: FileData) => {
    setEncryptFileData(data);
    setProcessingText({
      title: "Encrypting Your File",
      message: "Please wait while we securely encrypt your file..."
    });
    setActivePanel("processing");
  };

  const handleDecryptSubmit = (data: FileData) => {
    setDecryptFileData(data);
    setProcessingText({
      title: "Decrypting Your File",
      message: "Please wait while we securely decrypt your file..."
    });
    setActivePanel("processing");
  };

  const handleEncryptNewFile = () => {
    setActivePanel("encrypt");
    setEncryptFileData(null);
  };

  const handleDecryptNewFile = () => {
    setActivePanel("decrypt");
    setDecryptFileData(null);
  };

  const handleBackToHome = () => {
    setActivePanel(activeTab);
    setEncryptFileData(null);
    setDecryptFileData(null);
  };

  const handleRetry = () => {
    setActivePanel(activeTab);
  };

  const handleError = (error: ErrorData) => {
    setErrorData(error);
    setActivePanel("error");
  };

  const handleEncryptSuccess = (result: EncryptedFileData) => {
    setEncryptedResult(result);
    setActivePanel("encryptResult");
  };

  const handleDecryptSuccess = (result: DecryptedFileData) => {
    setDecryptedResult(result);
    setActivePanel("decryptResult");
  };

  // For tab switching
  const handleTabChange = (tab: "encrypt" | "decrypt") => {
    setActiveTab(tab);
    setActivePanel(tab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure File Encryption</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Safely encrypt and decrypt your sensitive files with industry-standard encryption. 
          Your files never leave your browser.
        </p>
      </header>

      <Card className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto mb-8">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 px-4 py-3 text-center font-medium ${
              activeTab === "encrypt" 
                ? "border-b-2 border-primary text-primary bg-primary-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("encrypt")}
          >
            <Shield className="inline-block mr-1 h-5 w-5" />
            Encrypt File
          </button>
          <button 
            className={`flex-1 px-4 py-3 text-center font-medium ${
              activeTab === "decrypt" 
                ? "border-b-2 border-primary text-primary bg-primary-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("decrypt")}
          >
            <LockOpen className="inline-block mr-1 h-5 w-5" />
            Decrypt File
          </button>
        </div>

        {activePanel === "encrypt" && (
          <EncryptPanel onSubmit={handleEncryptSubmit} />
        )}

        {activePanel === "decrypt" && (
          <DecryptPanel 
            onSubmit={handleDecryptSubmit} 
            initialFileId={params.id} 
          />
        )}

        {activePanel === "encryptResult" && encryptedResult && (
          <EncryptResultPanel 
            result={encryptedResult}
            onEncryptNewFile={handleEncryptNewFile}
            onBackToHome={handleBackToHome}
          />
        )}

        {activePanel === "decryptResult" && decryptedResult && (
          <DecryptResultPanel 
            result={decryptedResult}
            onDecryptNewFile={handleDecryptNewFile}
            onBackToHome={handleBackToHome}
          />
        )}

        {activePanel === "processing" && (
          <ProcessingPanel 
            title={processingText.title} 
            message={processingText.message} 
          />
        )}

        {activePanel === "error" && errorData && (
          <ErrorPanel 
            title={errorData.title}
            message={errorData.message}
            details={errorData.details}
            onRetry={handleRetry}
          />
        )}
      </Card>

      <SecurityInfo />
    </div>
  );
}
