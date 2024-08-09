import { useState } from "react";
import {Input} from "@headlessui/react";

interface ContactFormProps {
  // Props for any additional data needed
}

const ContactForm = ({}: /* props */ ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // Add other fields as needed
  });
  const [submitStatus, setSubmitStatus] = useState<string>(""); // 'success', 'error', or ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send data to Zoho CRM using fetch or axios
    try {
      const response = await fetch("/api/zoho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="border rounded-md p-2" // Add your custom styles
      />

      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="border rounded-md p-2 mt-2" // Add your custom styles
      />

      {/* Other form elements */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContactForm;
