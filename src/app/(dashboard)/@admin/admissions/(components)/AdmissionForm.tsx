"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useGetClassesQuery,
  // useGetClassArmsQuery,
  useGetSessionsQuery, // New query for sessions
  // useCreateStudentMutation,
  // useUpdateAdmissionMutation,
  useCreateAdmissionMutation,
} from "@/redux/api";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar"; // shadcn calendar
import { useImageConverter } from "@/lib/imageUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the form schema using Zod
const AdmissionFormSchema = z
  .object({
    // Student Info
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),
    dateOfBirth: z.date({ required_error: "Date of birth is required" }),
    sessionId: z.string().min(1, "Session is required"),
    presentClassId: z.string().min(1, "Present class is required"),
    classApplyingTo: z.string().min(1, "Class applying for is required"),
    homeAddress: z.string().min(1, "Home address is required"),
    contact: z.string().min(1, "Contact number is required"),
    religion: z.string().min(1, "Religion is required"),
    nationality: z.string().min(1, "Nationality is required"),
    stateOfOrigin: z.string().min(1, "State of origin is required"),
    lga: z.string().min(1, "LGA is required"),
    imageUrl: z.string().min(1, "Student image is required"),

    // Guardian Info
    guardianLastname: z.string().min(1, "Guardian last name is required"),
    guardianFirstname: z.string().min(1, "Guardian first name is required"),
    guardianOthername: z.string().optional(),
    guardianAddress: z.string().min(1, "Guardian address is required"),
    guardianTel: z.string().min(1, "Guardian contact number is required"),
    guardianEmail: z
      .string()
      .email("Invalid email address")
      .min(1, "Guardian email is required"),
    parentRelationship: z.enum(
      ["father", "mother", "brother", "sister", "guardian", "other"],
      {
        required_error: "Relationship is required",
      }
    ),
    otherRelationship: z.string().optional(),
    // Former School Info
    formerSchoolName: z.string().min(1, "School name is required"),
    formerSchoolAddress: z.string().min(1, "School address is required"),
    formerSchoolContact: z.string().min(1, "School contact is required"),

    // Other Info
    specialHealthProblems: z.string().optional(),
    howDidYouHearAboutUs: z.string().min(1, "This field is required"),
  })
  .refine(
    (data) => {
      // If relationship is "other", otherRelationship must be provided
      if (data.parentRelationship === "other") {
        return (
          !!data.otherRelationship && data.otherRelationship.trim().length > 0
        );
      }
      // Otherwise, it's optional
      return true;
    },
    {
      message: "Please specify the relationship",
      path: ["otherRelationship"], // This shows the error on the otherRelationship field
    }
  );
type AdmissionFormValues = z.infer<typeof AdmissionFormSchema>;

interface AdmissionFormProps {
  admissionId?: string;
  isEditMode?: boolean;
  // studentId?: string;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({
  admissionId,
  isEditMode = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const { convertImage } = useImageConverter();
  // Fetch sessions, classes, class arms, and parents

  const { data: sessionsData, isLoading: sessionsLoading } =
    useGetSessionsQuery({});
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery(
    {}
  );
  // const { data: classArmsData, isLoading: classArmsLoading } =
  //   useGetClassArmsQuery({});

  const [createAdmission, { isLoading: isCreating }] =
    useCreateAdmissionMutation();
  // const [updateAdmission, { isLoading: isUpdating }] = useUpdateAdmissionMutation();

  // Initialize the form with React Hook Form
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(AdmissionFormSchema),
    defaultValues: {
      // Student Info
      firstname: "",
      lastname: "",
      email: "",
      gender: undefined,
      dateOfBirth: undefined,
      sessionId: "",
      presentClassId: "",
      classApplyingTo: "",
      contact: "",
      religion: "",
      nationality: "",
      stateOfOrigin: "",
      lga: "",
      imageUrl: "", // Initialize imageUrl as empty string
      homeAddress: "",

      // Guardian Info
      guardianLastname: "",
      guardianFirstname: "",
      guardianOthername: "",
      guardianAddress: "",
      guardianTel: "",
      guardianEmail: "",
      parentRelationship: undefined,
      otherRelationship: "",

      // Former School Info
      formerSchoolName: "",
      formerSchoolAddress: "",
      formerSchoolContact: "",

      // Other Info
      specialHealthProblems: "",
      howDidYouHearAboutUs: "",
    },
  });

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       setPreview(base64String);
  //       form.setValue("imageUrl", base64String);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertImage(file, {
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          outputFormat: "jpeg",
        });

        setPreview(base64String);
        form.setValue("imageUrl", base64String);
      } catch (error) {
        console.error("Image conversion failed:", error);
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  const onSubmit = async (values: AdmissionFormValues) => {
    try {
      // Restructured payload following the exact format provided
      const submissionData = {
        sessionId: values.sessionId,
        // schoolId: "e4aa619d-fbdf-4682-b7d6-6bf45a26533d", // You might need to get this from context or props
        presentClassId: values.presentClassId,
        classApplyingTo: values.classApplyingTo,
        imageBase64: values.imageUrl, // Image as base64 in the main object

        // Student data as a nested object
        student: {
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          contact: values.contact,
          gender: values.gender,
          religion: values.religion,
          nationality: values.nationality,
          stateOfOrigin: values.stateOfOrigin,
          lga: values.lga,
          dateOfBirth: values.dateOfBirth
            ? values.dateOfBirth.toISOString()
            : null,
          homeAddress: values.homeAddress,
        },

        // Parent data as a nested object
        parent: {
          firstname: values.guardianFirstname,
          lastname: values.guardianLastname,
          othername: values.guardianOthername || "",
          email: values.guardianEmail,
          contact: values.guardianTel,
          address: values.guardianAddress,
          relationship:
            values.parentRelationship === "other"
              ? values.otherRelationship
              : values.parentRelationship,
        },

        // Former school data as a nested object
        formerSchool: {
          name: values.formerSchoolName,
          address: values.formerSchoolAddress,
          contact: values.formerSchoolContact,
        },

        // Other info as a nested object
        otherInfo: {
          healthProblems: values.specialHealthProblems || "None",
          howHeardAboutUs: values.howDidYouHearAboutUs,
        },
      };
      // Add this line to see the data in the console
      // console.log("Form submitted with data:", submissionData);
      if (isEditMode && admissionId) {
        // await updateAdmission({ id: admissionId, ...submissionData }).unwrap();
        toast.success("Admission updated", {
          description: "The admission has been updated successfully.",
        });
      } else {
        await createAdmission(submissionData).unwrap();
        toast.success("Admission created", {
          description: "The admission has been created successfully.",
        });
      }
      router.push("/admissions");
    } catch (error) {
      console.log(error, "Error creating/updating admission");
      toast.error(`Failed to save the admission. Please try again.`);
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-md '>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 mx-10'
        >
          {/* Header and Subheader */}
          <div className='text-center mb-6'>
            <h1 className='text-primary font-bold text-2xl'>Admission Form</h1>
            <p className='text-gray-600'>Enter new student details below</p>
          </div>

          {/* Student Details */}
          <div className='flex items-center gap-4 md:my-5'>
            <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
              Student Information
            </h2>
            <Separator className='flex-1 border border-gray-300' />
          </div>
          <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
            <div className=' p-4 flex flex-col'>
              <div className='flex flex-col items-center'>
                <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                  {preview ? (
                    <Image
                      height={32}
                      width={32}
                      src={preview}
                      alt='Admission Student Image preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-primary text-sm text-center bg-[#E7E7E7] rounded-full p-2'>
                      <Image
                        height={32}
                        width={32}
                        src={"/user-circle-02.svg"}
                        alt='Admission Student Image preview'
                        className='w-full h-full object-cover'
                      />
                    </span>
                  )}
                </div>
                <Label htmlFor='image-upload' className='mt-4'>
                  <div className='border-primary text-primary hover:border-primary/70 border-2 rounded-md flex items-center p-2 space-x-2'>
                    <Image
                      height={16}
                      width={16}
                      src={"/image-upload.svg"}
                      alt='Admission Student Image preview'
                      className=''
                    />{" "}
                    <span className=''>Upload Student Image</span>
                  </div>
                </Label>
                <Input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                  required
                />
                {!preview && (
                  <p className='text-red-500 text-xs mt-2'>
                    *Student image is required
                  </p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
              <FormField
                control={form.control}
                name='sessionId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='choose...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionsLoading ? (
                          <SelectItem value='loading' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          sessionsData?.data?.map((session: any) => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.name.slice(0, 9)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='presentClassId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Present Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='choose...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classesLoading ? (
                          <SelectItem value='loading' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          classesData?.map((classItem: any) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='classApplyingTo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Applying For</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='choose...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classesLoading ? (
                          <SelectItem value='loading' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          classesData?.map((classItem: any) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='male'>Male</SelectItem>
                        <SelectItem value='female'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='homeAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Home address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tel</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Tel' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem className='flex flex-col '>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal justify-start",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Choose a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='religion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter religion' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nationality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter nationality' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stateOfOrigin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter state of origin' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lga'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LGA</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter LGA' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex items-center gap-4 my-5'>
            <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
              Guardian&apos;s Information
            </h2>
            <Separator className='flex-1 border border-gray-300' />
          </div>
          <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
            <div className='hidden md:block p-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='guardianLastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='guardianFirstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='guardianOthername'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter other name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='guardianAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='guardianTel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tel</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter telephone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='guardianEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentRelationship'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship to Student</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      onOpenChange={() =>
                        form.setValue("otherRelationship", "")
                      }
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select relationship' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='father'>Father</SelectItem>
                        <SelectItem value='mother'>Mother</SelectItem>
                        <SelectItem value='brother'>Brother</SelectItem>
                        <SelectItem value='sister'>Sister</SelectItem>
                        <SelectItem value='guardian'>Guardian</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("parentRelationship") === "other" && (
                <FormField
                  control={form.control}
                  name='otherRelationship'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter relationship' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className='flex items-center gap-4 md:my-5'>
            <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
              Former School&apos;s Information
            </h2>
            <Separator className='flex-1 border border-gray-300' />
          </div>
          <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
            <div className='hidden md:block p-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='formerSchoolName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter school name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='formerSchoolAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter school address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='formerSchoolContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Contact</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter school contact' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex items-center gap-4 md:my-5'>
            <h2 className='text-primary opacity-75 font-lato font-bold text-base'>
              Other Information
            </h2>
            <Separator className='flex-1 border border-gray-300' />
          </div>
          <div className='grid md:grid-cols-[1fr_3fr] gap-4'>
            <div className='hidden md:block p-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='specialHealthProblems'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Health Problems (if any)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter health problems if any'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='howDidYouHearAboutUs'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your response' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            {/* <Button
            type='button'
            variant='outline'
            onClick={onSuccess}
            disabled={isCreating}
          >
            Cancel
          </Button> */}
            <Button type='submit' disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                <>{isEditMode ? "Update" : "Submit"} Application</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdmissionForm;
