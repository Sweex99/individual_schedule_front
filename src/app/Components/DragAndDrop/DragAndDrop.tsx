import { useDropzone } from 'react-dropzone';
import { Container, RemoveButton } from './DragAndDrop.styles';
import { useCallback, useEffect, useState } from "react";
import { ImagePreview } from "../../Pages/Dashboard/Student/Steps/FirstStep/FirstStep.styles";

interface DragAndDropProps {
  fieldName: string;
  description: string;
  setFileObject: (file: File | null) => void;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({ fieldName, description, setFileObject }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': []
    },
  });

  const clearPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // передаємо файл у форму
  useEffect(() => {
    setFileObject(selectedFile);
  }, [selectedFile, setFileObject]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} name={fieldName} id={fieldName} />

      {previewUrl ? (
        <>
          <RemoveButton onClick={clearPreview}>🗑️</RemoveButton>
          {previewUrl && (
            <ImagePreview src={previewUrl} alt="Прев’ю зображення" />
          )}

          <label>{selectedFile?.name}</label>
        </>
      ) : (
        <Container isDragActive={isDragActive}>
          <p>{isDragActive ? "Відпустіть файл тут..." : description}</p>
        </Container>
      )}
    </div>
  );
};
