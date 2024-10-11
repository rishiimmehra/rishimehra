import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";
import {
  Checkbox,
  Input,
  Label,
  Textarea,
  Field,
  Dialog,
} from "@headlessui/react";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  CountryCode,
} from "libphonenumber-js"; // Add CountryCode here

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [isDialogOpen, setIsDialogOpen] = useState(false); // New state for dialog visibility

  const formRef = useRef<HTMLFormElement>(null);

  const handleProjectTypeChange = (type: ProjectType) => {
    if (projectTypes.includes(type)) {
      setProjectTypes(projectTypes.filter((t) => t !== type));
    } else {
      setProjectTypes([...projectTypes, type]);
    }
  };

  const handlePhoneNumberChange = (
    value: string,
    country: any,
    e: any,
    formattedValue: string
  ) => {
    setPhoneNumber(formattedValue);
    setPhoneError(null);
  };

  const validatePhoneNumber = (
    phoneNumber: string,
    countryCode: string | undefined
  ) => {
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      return false;
    }

    // Ensure countryCode is defined and cast it to the appropriate type
    if (countryCode) {
      const phoneNumberInstance = parsePhoneNumberFromString(
        phoneNumber,
        countryCode as CountryCode
      );
      if (!phoneNumberInstance || !phoneNumberInstance.isValid()) {
        setPhoneError(
          "Please enter a valid phone number for the selected country"
        );
        return false;
      }
    } else {
      setPhoneError("Country code is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPhoneError(null);
    setSuccessMessage(null); // Reset success message
    setIsLoading(true); // Set loading to true when the form is submitted

    if (projectTypes.length === 0) {
      setFormError("Please select at least one project type.");
      return;
    }

    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    // Validate phone number
    const phoneInput = document.querySelector(
      'input[type="tel"]'
    ) as HTMLInputElement;
    if (phoneInput) {
      const countryCode = phoneInput.getAttribute("data-country") || undefined; // Ensure it's defined
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
      const response = await fetch("/api/leadform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);
      setSuccessMessage(
        "Form sent successfully. I will contact you in the next 24 hours. Stay well and calm."
      ); // Set success message
      setIsDialogOpen(true); // Open dialog on success

      // Redirect after 5 seconds
      setTimeout(() => {
        window.location.href = "/"; // Redirect to home page
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        "An error occurred while submitting the form. Please try again."
      );

      // Send contact details to your email
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, error: error.message }),
      });
    } finally {
      setIsLoading(false); // Reset loading state after submission
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
        ref={formRef}
        noValidate
      >
        <div>
          <Field as="div" className="flex flex-col gap-3">
            <Label htmlFor="projectTypes">
              I am interested in... (required)
            </Label>
            <div className="flex flex-wrap gap-4">
              {(
                [
                  "Business Website",
                  "Blog",
                  "Online Store",
                  "E-commerce",
                ] as const
              ).map((type) => (
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
            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError}</p>
            )}
          </Field>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            className="w-1/2 rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
            required
            title="Please enter your first name"
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            className="w-1/2 rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
            required
            title="Please enter your last name"
          />
        </div>
        <div className="flex flex-col gap-4 w-full sm:flex-row">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="w-auto sm:w-1/2 rounded-lg h-10 px-4 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
            required
            title="Please enter a valid email address"
          />
          <div className="flex flex-col w-auto sm:w-1/2">
            <PhoneInput
              country={"in"}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              containerClass="flex bg-[var(--sand2)] px-4 rounded-lg focus-within:!outline"
              inputClass="bg-[var(--sand2)] !overflow-hidden w-full"
              buttonClass="!static !bg-transparent hover:!bg-transparent focus:!bg-transparent !border-r-1 !border-l-0 !border-y-0 !border-primary !-order-1"
              inputProps={{
                required: true,
                className:
                  "bg-transparent h-10 focus-visible:!outline-none pl-4",
                title: "Please enter a valid phone number",
                "data-country": "IN", // Make sure to set a default country code
              }}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-2">{phoneError}</p>
            )}
          </div>
        </div>
        <Textarea
          placeholder="Tell me about your project."
          rows={3}
          value={projectDetails}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setProjectDetails(e.target.value)
          }
          className="w-full rounded-lg px-4 py-2 placeholder:text-secondary text-primary bg-[var(--sand2)] transition"
          required
          title="Please provide some details about your project"
        />
        <button
          type="submit"
          className="bg-brand w-auto text-white flex justify-center mt-8 py-2 px-4 rounded-lg hover:bg-primary-dark transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="flex text-gray-200 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="text-white"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}{" "}
        </button>
      </form>

      {/* Headless UI Dialog for success message */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="fixed z-9 backdrop-blur-2xl inset-0 overflow-y-auto bg-[rgb(23 21 22 / 40%)]"
      >
        <div className="flex items-center justify-center min-h-screen px-5 sm:px-10">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-primary rounded-xl z-20 border border-solid border-primary w-full max-w-[456px]">
            <Dialog.Title className="text-lg font-medium h-40 flex flex-col items-center justify-center gap-4 text-white">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="58"
                  height="58"
                  rx="29"
                  fill="#018505"
                  fillOpacity={0.3}
                />
                <mask
                  id="mask0_273_11"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="11"
                  y="11"
                  width="36"
                  height="36"
                >
                  <rect x="11" y="11" width="36" height="36" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_273_11)">
                  <path
                    d="M23.9 44.75L21.05 39.95L15.65 38.75L16.175 33.2L12.5 29L16.175 24.8L15.65 19.25L21.05 18.05L23.9 13.25L29 15.425L34.1 13.25L36.95 18.05L42.35 19.25L41.825 24.8L45.5 29L41.825 33.2L42.35 38.75L36.95 39.95L34.1 44.75L29 42.575L23.9 44.75ZM25.175 40.925L29 39.275L32.9 40.925L35 37.325L39.125 36.35L38.75 32.15L41.525 29L38.75 25.775L39.125 21.575L35 20.675L32.825 17.075L29 18.725L25.1 17.075L23 20.675L18.875 21.575L19.25 25.775L16.475 29L19.25 32.15L18.875 36.425L23 37.325L25.175 40.925ZM27.425 34.325L35.9 25.85L33.8 23.675L27.425 30.05L24.2 26.9L22.1 29L27.425 34.325Z"
                    fill="#F6FEF3"
                  />
                </g>
              </svg>
              <h2 className="text-2xl font-medium tracking-wide">Message Sent!</h2>
            </Dialog.Title>
            <Dialog.Description className="h-24 flex justify-center items-center border-t border-solid border-primary leading-[1.8] px-5 sm:px-10 mt-2 text-center text-sm font-medium text-white">
              {successMessage}
            </Dialog.Description>
            <div className="mt-0">
              <button
                type="button"
                className="bg-brand text-white px-4 py-2 rounded hidden"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ContactForm;
