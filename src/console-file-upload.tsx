import { createRoot, type Root } from "react-dom/client";
import { FileUpload } from "@/components/ui/file-upload";
import uploaderStyles from "./components/ui/file-upload.css?inline";

// The private console is a lightweight static shell; mount the same React FileUpload
// used by website forms only while the authorized upload dialog is open.
const styleId="vv-file-upload-shared-styles";
if(!document.getElementById(styleId)){
  const style=document.createElement("style");
  style.id=styleId;
  style.textContent=uploaderStyles;
  document.head.appendChild(style);
}
let root: Root|null=null;
function unmountUpload(){
  if(root){root.unmount();root=null;}
}
function mountUpload(){
  const target=document.getElementById("vv-upload-mount");
  if(!target)return;
  unmountUpload();
  root=createRoot(target);
  root.render(
    <FileUpload
      onChange={(files)=>document.dispatchEvent(new CustomEvent("vv:upload-selection",{detail:{files}}))}
      accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.txt,.zip"
      maxFiles={1}
      maxSizeBytes={25*1024*1024}
    />
  );
}
document.addEventListener("vv:mount-upload",mountUpload);
document.addEventListener("vv:unmount-upload",unmountUpload);
