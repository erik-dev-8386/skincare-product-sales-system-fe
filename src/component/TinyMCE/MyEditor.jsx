

import { Editor } from "@tinymce/tinymce-react";

const MyEditor = ({ value = "", onChange, placeholder = "" }) => {
  return (
    <Editor
      apiKey="tfcwpqgq6a6ig09su4t9ghne6t9iwqtujbt2x0w76b2g5d6u"
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height: 300,
        menubar: false,
        plugins: "lists link image charmap preview",
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code",
        placeholder: placeholder,
        entity_encoding: "raw",
        encoding: "html",
      }}
    />
  );
};

export default MyEditor;

