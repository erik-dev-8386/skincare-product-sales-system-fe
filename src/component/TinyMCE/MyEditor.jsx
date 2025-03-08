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
      apiKey="4npo5g1r2pw2al8kg3ugehxbsbell9jiu4ro31b9kwjd10sx"
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height: 300,
        menubar: false,
        plugins: "lists link image charmap preview", // Removed "print"
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code",
      }}
    />
  );
};

export default MyEditor;

