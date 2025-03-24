"use client"; 
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
interface ICKEditorWrapperProps {
  value?: string;
  onChange?: (data: string) => void;
}

const CKEditorWrapper: React.FC<ICKEditorWrapperProps> = ({
  value = "",
  onChange,
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onReady={(editor: any) => {
        editor.editing.view.change((writer :any) => {
          const root = editor.editing.view.document.getRoot();
          if (root) {
            writer.setStyle("height", "200px", root);
          }
        });
      }}
      onChange={(event:any, editor:any) => {
        const data = editor.getData();
        onChange?.(data);
      //   console.log("CKEditor data:", data);
     }}
    />
  );
};

export default CKEditorWrapper;
