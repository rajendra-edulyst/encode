import { toast } from "sonner";

export const successToast = (title: string, description = "") => toast.success(title, {
    description,
    duration: 5000,
    position: "top-center",
    style: { background: "#f0f4f8", color: "#333" },
});

export const errorToast = (title: string, description = "") => toast.error(title, {
    description,
    duration: 5000,
    position: "top-center",
    style: { background: "#fff1f1", color: "#d63384" },
});
