// import { Editor } from "@tinymce/tinymce-react";
// import { useRef } from "react";



// const MyEditor = ({ value = "", onChange }) => {
//     return (
//         <Editor
//             apiKey="4252vg9lszf4i9jba7py4l2img6b7z2ljeudq1q8b00hb5h2"
//             value={value}
//             onEditorChange={(newValue) => onChange(newValue)}
//             init={{
//                 height: 300,
//                 menubar: false,
//                 plugins: "lists link image charmap print preview",
//                 toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code",
//             }}
//         />
//     );
// };


// export default MyEditor;

import { Editor } from "@tinymce/tinymce-react";

const MyEditor = ({ value = "", onChange }) => {
  return (
    <Editor
      apiKey="tfcwpqgq6a6ig09su4t9ghne6t9iwqtujbt2x0w76b2g5d6u"
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height: 300,
        menubar: false,
        plugins: "lists link image charmap preview", // Removed "print"
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code",
        // Cấu hình để hỗ trợ UTF-8
        entity_encoding: "raw", // Giữ nguyên ký tự gốc, không mã hóa thành HTML entities
        encoding: "html", // Xử lý dữ liệu dưới dạng HTML nhưng giữ UTF-8
      }}
    />
  );
};

export default MyEditor;

