import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (code: string, filename: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      readFile(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Read file content
  const readFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onUpload(content, file.name);
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Or upload a file</span>
        <div className="text-xs text-gray-500">Max 10MB</div>
      </div>
      <label 
        htmlFor="file-upload" 
        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'
        } rounded-md cursor-pointer hover:border-gray-400`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Choose a file
            </span>
            <span> or drag and drop</span>
          </div>
          <p className="text-xs text-gray-500">
            Supports source code files (.js, .py, .java, etc.)
          </p>
        </div>
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.cpp,.c,.php,.rb,.go,.rs,.swift,.kt,.html,.css,.sql,.sh,.ps1,.pl,.r,.m"
        />
      </label>
    </div>
  );
}
