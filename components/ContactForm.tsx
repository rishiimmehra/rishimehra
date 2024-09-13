import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";
import {
  Checkbox,
  Input,
  Label,
  Textarea,
  Field,
} from "@headlessui/react";

// Define types
type ProjectType = "Business Website" | "Blog Website" | "Online Store" | "E-commerce Platform";

interface FormData {
  projectTypes: ProjectType[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  projectDetails: string;
}

function ContactForm() {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [projectDetails, setProjectDetails] = useState("");

  const handleProjectTypeChange = (type: ProjectType) => {
    if (projectTypes.includes(type)) {
      setProjectTypes(projectTypes.filter((t) => t !== type));
    } else {
      setProjectTypes([...projectTypes, type]);
    }
  };

  const handlePhoneNumberChange = (value: string, country: any, e: any, formattedValue: string) => {
    setPhoneNumber(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: FormData = {
      projectTypes,
      firstName,
      lastName,
      email,
      phoneNumber,
      projectDetails,
    };

    try {
      const response = await fetch('/api/leadform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Form submitted successfully:', data);
      // Handle success, e.g., show a success message
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <Field as="div" className="flex flex-col gap-3">
          <Label htmlFor="projectTypes">I am interested in...</Label>
          <div className="flex flex-wrap gap-4">
            {(["Business Website", "Blog Website", "Online Store", "E-commerce Platform"] as const).map((type) => (
              <Checkbox
                key={type}
                checked={projectTypes.includes(type)}
                onChange={() => handleProjectTypeChange(type)}
                className="flex items-center cursor-pointer rounded-full h-10 px-4 text-secondary bg-[var(--sand2)] transition data-[checked]:outline data-[checked]:text-primary"
              >
                {type}
              </Checkbox>
            ))}
          </div>
        </Field>
      </div>
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
        />
      </div>
      <div className="flex flex-row gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
        />
        <PhoneInput
          country={"in"}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          containerClass="bg-[var(--sand2)]"
          inputClass="bg-[var(--sand2)]"
          buttonClass="bg-[var(--sand2)]"
        />
      </div>
      <Textarea
        placeholder="Tell me about your project."
        value={projectDetails}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProjectDetails(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactForm;