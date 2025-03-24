import { IoMdClose } from "react-icons/io";
let isVisible = false;

function addNotification({ message, type }) {
  let toast =
    typeof window !== "undefined" && document.getElementById("toast-root");

  const icon = document.createElement("img");

  if (isVisible || !toast) return;
  if (type === "success") {
    toast.classList.add("toast", "toast_success");
  }
  if (type === "error") {
    toast.classList.add("toast", "toast_error");
  }
  if (type === "warning") {
    toast.classList.add("toast", "toast_warning");
  }

  icon.src = <IoMdClose />;
  icon.style.cursor = "pointer";

  toast.appendChild(icon);
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = message;
  toast.appendChild(messageDiv);
  isVisible = true;

  const handleCloseToast = () => {
    toast.innerHTML = "";
    toast.className = "";
    isVisible = false;
  };
  icon.addEventListener("click", handleCloseToast);
  if (toast) {
    toast.addEventListener("animationend", handleCloseToast);
  }
}

const notification = {
  success: ({ message }) => {
    addNotification({ message, type: "success" });
  },
  warning: ({ message }) => {
    addNotification({ message, type: "warning" });
  },
  error: ({ message }) => {
    addNotification({ message, type: "error" });
  },
};

export default notification;
