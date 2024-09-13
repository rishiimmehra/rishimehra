import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";
import {
  Checkbox,
  Input,
  Label,
  Textarea,
  Field,
} from "@headlessui/react";
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

type ProjectType = "Business Website" | "Blog" | "Online Store" | "E-commerce";

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
  const [formError, setFormError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleProjectTypeChange = (type: ProjectType) => {
    if (projectTypes.includes(type)) {
      setProjectTypes(projectTypes.filter((t) => t !== type));
    } else {
      setProjectTypes([...projectTypes, type]);
    }
  };

  const handlePhoneNumberChange = (value: string, country: any, e: any, formattedValue: string) => {
    setPhoneNumber(formattedValue);
    setPhoneError(null);
  };

  const validatePhoneNumber = (phoneNumber: string, countryCode: string) => {
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      return false;
    }
    
    const phoneNumberInstance = parsePhoneNumberFromString(phoneNumber, countryCode);
    if (!phoneNumberInstance || !phoneNumberInstance.isValid()) {
      setPhoneError("Please enter a valid phone number for the selected country");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPhoneError(null);

    if (projectTypes.length === 0) {
      setFormError("Please select at least one project type.");
      return;
    }

    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    // Validate phone number
    const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
    if (phoneInput) {
      const countryCode = phoneInput.getAttribute('data-country');
      if (countryCode && !validatePhoneNumber(phoneNumber, countryCode)) {
        return;
      }
    }

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
      setFormError("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" ref={formRef} noValidate>
      <div>
        <Field as="div" className="flex flex-col gap-3">
          <Label htmlFor="projectTypes">I am interested in... (required)</Label>
          <div className="flex flex-wrap gap-4">
            {(["Business Website", "Blog", "Online Store", "E-commerce"] as const).map((type) => (
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
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </Field>
      </div>
      <div className="flex flex-row gap-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
          required
          title="Please enter your first name"
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
          required
          title="Please enter your last name"
        />
      </div>
      <div className="flex flex-row gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
          required
          title="Please enter a valid email address"
        />
        <div className="flex-grow">
          <PhoneInput
            country={"in"}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            containerClass="bg-[var(--sand2)]"
            inputClass="bg-[var(--sand2)] w-full"
            buttonClass="bg-[var(--sand2)]"
            inputProps={{
              required: true,
              className: "w-full h-10",
              title: "Please enter a valid phone number",
              'data-country': 'IN', // Make sure to set a default country code
            }}
          />
          {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
        </div>
      </div>
      <Textarea
        placeholder="Tell me about your project."
        value={projectDetails}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProjectDetails(e.target.value)}
        required
        title="Please provide some details about your project"
      />
      <button type="submit" className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition">Submit</button>
    </form>
  );
}

export default ContactForm;
