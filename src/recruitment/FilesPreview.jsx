import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FilesPreview = () => {
  const navigate = useNavigate();
  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("fileUrls") || "[]");
    if (storedFiles.length === 0) {
      navigate("/"); // Jeśli brak plików, wróć na stronę główną
    } else {
      setFileUrls(storedFiles);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-glass-dark pt-32">

      <div className=" p-4 rounded-lg shadow-lg w-full overflow-y-auto">
        {fileUrls.map((fileUrl, index) => (
          <div key={index} className="mb-4">
            {fileUrl.endsWith(".pdf") ? (
              <iframe src={fileUrl} className="w-full border border-gray-300 rounded-lg"></iframe>
            ) : (
              <img src={fileUrl} alt={`Preview ${index + 1}`} className="w-auto max-h-screen rounded-lg mx-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesPreview;
