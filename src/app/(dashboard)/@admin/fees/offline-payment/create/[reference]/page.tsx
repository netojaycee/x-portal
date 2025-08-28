"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetInvoiceByCodeQuery,
  useCreateOfflinePaymentMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, ArrowLeft, FileImage, Loader2 } from "lucide-react";
import Image from "next/image";
import { useImageConverter } from "@/lib/imageUtils";

const CreateOfflinePaymentPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  //   const reference = params.reference as string;

  const reference = Array.isArray(params?.reference)
    ? params.reference[0]
    : params?.reference;

  const decodedReference = reference ? decodeURIComponent(reference) : "";

  const [paymentData, setPaymentData] = useState({
    studentId: "",
    amount: "",
    notes: "",
    paymentProof: null as string | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch invoice data
  const {
    data: invoiceData,
    isLoading,
    error,
  } = useGetInvoiceByCodeQuery(
    { reference: decodedReference },
    {
      skip: !decodedReference,
    }
  );
  const [
    createOfflinePayment,
    { isLoading: isCreating },
  ] = useCreateOfflinePaymentMutation();

  // Filter students with unpaid or partial status
  const pendingStudents = useMemo(
    () =>
      invoiceData?.studentInvoiceAssignments?.filter(
        (assignment: any) =>
          assignment.status === "unpaid" || assignment.status === "partial"
      ) || [],
    [invoiceData?.studentInvoiceAssignments]
  );

  // Auto-select student ID if it's a single invoice and there's only one pending student
  useEffect(() => {
    if (invoiceData?.invoiceType === "single" && pendingStudents.length === 1) {
      setPaymentData((prev) => ({
        ...prev,
        studentId: pendingStudents[0].studentId,
      }));
    }
  }, [invoiceData?.invoiceType, pendingStudents]);

  const { convertImage } = useImageConverter();

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

        setPreviewUrl(base64String);
        setPaymentData((prev) => ({ ...prev, paymentProof: base64String }));
      } catch (error) {
        console.error("Image conversion failed:", error);
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!paymentData.studentId) {
      toast.error("Please select a student");
      return;
    }

    if (!paymentData.amount) {
      toast.error("Please enter the payment amount");
      return;
    }

    if (!paymentData.paymentProof) {
      toast.error("Please upload payment proof");
      return;
    }

    const selectedAssignment = pendingStudents.find(
      (a: any) => a.studentId === paymentData.studentId
    );

    if (!selectedAssignment) {
      toast.error("Invalid student selection");
      return;
    }

    const outstanding =
      selectedAssignment.status === "partial"
        ? invoiceData?.amount - (selectedAssignment.paid || 0)
        : invoiceData?.amount;

    if (parseFloat(paymentData.amount) > outstanding) {
      toast.error("Payment amount cannot exceed outstanding amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the offline payment data to the backend
      const submissionData = {
        invoiceId: invoiceData?.id,
        studentId: paymentData.studentId,
        amount: parseFloat(paymentData.amount),
        notes: paymentData.notes,
        proofOfPayment: paymentData.paymentProof,
      };
    console.log(submissionData);

      // Here you would make the actual API call
      await createOfflinePayment(submissionData);

      toast.success("Payment recorded successfully!");
      // router.push("/fees");
    } catch (error: any) {
      console.error("Error creating offline payment:", error);
      toast.error(
        error?.message || "Failed to record offline payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error || !invoiceData) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Invoice Not Found
          </h1>
          <p className='text-gray-600 mb-4'>
            The invoice with reference &quot;{reference}&quot; could not be
            found.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              onClick={() => router.back()}
              className='flex items-center space-x-2'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Back</span>
            </Button>
            <div>
              <h1 className='text-xl font-bold'>Record Offline Payment</h1>
              <p className='text-gray-600'>
                Invoice Reference: {decodedReference}
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {/* Invoice Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* General Invoice Info */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      Title
                    </Label>
                    <p className='font-semibold'>{invoiceData?.title}</p>
                  </div>
                  {/* <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      Reference
                    </Label>
                    <p className='font-semibold'>
                      {invoiceData?.reference}
                    </p>
                  </div> */}
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      Session
                    </Label>
                    <p className='font-semibold'>
                      {invoiceData?.session?.name}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>
                      Term
                    </Label>
                    <p className='font-semibold'>{invoiceData?.term?.name}</p>
                  </div>
                  <div className=''>
                    <Label className='text-sm font-medium text-gray-600'>
                      Fee Amount
                    </Label>
                    <p className='text-lg font-bold text-blue-600'>
                      ₦{invoiceData?.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Student Payment Details */}
                <div className='border-t pt-4'>
                  {invoiceData?.invoiceType === "single" ? (
                    // Single Invoice: Always show student details
                    pendingStudents.length > 0 && (
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label className='text-sm font-medium text-gray-600'>
                            Student Name
                          </Label>
                          <p className='font-semibold'>
                            {pendingStudents[0].student.user.firstname}{" "}
                            {pendingStudents[0].student.user.lastname}
                          </p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-600'>
                            Registration No
                          </Label>
                          <p className='font-semibold'>
                            {pendingStudents[0].student.studentRegNo}
                          </p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-600'>
                            Amount Paid
                          </Label>
                          <p className='font-bold text-green-600'>
                            ₦{pendingStudents[0].paid?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-600'>
                            Outstanding
                          </Label>
                          <p className='font-bold text-red-600'>
                            ₦{pendingStudents[0].outstanding?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium text-gray-600'>
                            Status
                          </Label>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              pendingStudents[0].status === "paid"
                                ? "bg-green-100 text-green-800"
                                : pendingStudents[0].status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pendingStudents[0].status}
                          </span>
                        </div>
                      </div>
                    )
                  ) : // Mass Invoice: Show selected student details
                  paymentData.studentId ? (
                    (() => {
                      const selectedStudent = pendingStudents.find(
                        (s: any) => s.studentId === paymentData.studentId
                      );
                      return selectedStudent ? (
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Student Name
                            </Label>
                            <p className='font-semibold'>
                              {selectedStudent.student.user.firstname}{" "}
                              {selectedStudent.student.user.lastname}
                            </p>
                          </div>
                          <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Registration No
                            </Label>
                            <p className='font-semibold'>
                              {selectedStudent.student.studentRegNo}
                            </p>
                          </div>
                          {/* <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Class
                            </Label>
                            <p className='font-semibold'>
                              {invoiceData?.classes?.map((cls: any) => cls?.class?.name).join(", ")}
                            </p>
                          </div> */}
                          <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Amount Paid
                            </Label>
                            <p className='font-bold text-green-600'>
                              ₦{selectedStudent.paid?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Outstanding
                            </Label>
                            <p className='font-bold text-red-600'>
                              ₦{selectedStudent.outstanding?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className='text-sm font-medium text-gray-600'>
                              Status
                            </Label>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                selectedStudent.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : selectedStudent.status === "partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {selectedStudent.status}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()
                  ) : (
                    <div className='text-center text-gray-500 py-4'>
                      Select a student to view payment details
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Show student selector only for mass invoice or multiple pending students */}
                {(invoiceData?.invoiceType === "mass" ||
                  pendingStudents.length > 1) && (
                  <div className='space-y-2'>
                    <Label htmlFor='student'>Select Student for Payment</Label>
                    <Select
                      value={paymentData.studentId}
                      onValueChange={(value) =>
                        setPaymentData((prev) => ({
                          ...prev,
                          studentId: value,
                        }))
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a student' />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingStudents.map((assignment: any) => (
                          <SelectItem
                            key={assignment.studentId}
                            value={assignment.studentId}
                          >
                            {assignment.student.user.firstname}{" "}
                            {assignment.student.user.lastname}
                            {" - "}
                            {assignment.student.studentRegNo}
                            {/* {invoiceData?.invoiceType === "mass" &&
                              ` (${assignment.student.classId})`} */}
                            {assignment.status === "partial" &&
                              ` (Paid: ₦${
                                assignment.paid?.toLocaleString() || 0
                              } of ₦${invoiceData?.amount?.toLocaleString()})`}
                            {assignment.status === "unpaid" &&
                              ` (Pending: ₦${invoiceData?.amount?.toLocaleString()})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor='amount'>Payment Amount (₦)</Label>
                  <Input
                    id='amount'
                    type='number'
                    placeholder='Enter payment amount'
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='paymentProof'>Payment Proof *</Label>
                  <div className='mt-2'>
                    <div className='flex items-center justify-center w-full'>
                      <label
                        htmlFor='paymentProof'
                        className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
                      >
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <Upload className='w-8 h-8 mb-2 text-gray-500' />
                          <p className='mb-2 text-sm text-gray-500'>
                            <span className='font-semibold'>
                              Click to upload
                            </span>{" "}
                            payment proof
                          </p>
                          <p className='text-xs text-gray-500'>
                            PNG, JPG, JPEG up to 5MB
                          </p>
                        </div>
                        <input
                          id='paymentProof'
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>

                    {/* Preview */}
                    {previewUrl && (
                      <div className='mt-4'>
                        <Label className='text-sm font-medium'>Preview:</Label>
                        <div className='mt-2 w-full h-20 flex items-start rounded-lg overflow-hidden'>
                          <Image
                            src={previewUrl}
                            alt='Payment proof preview'
                            width={80}
                            height={80}
                            className='object-contain'
                          />
                        </div>
                        <p className='text-sm text-gray-500 mt-2 flex items-center'>
                          <FileImage className='h-4 w-4 mr-1' />
                          {/* {paymentData.paymentProof?.name} */}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex justify-end space-x-4 pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.back()}
                    disabled={isSubmitting || isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting || isCreating}>
                    {isCreating || isSubmitting && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    {isSubmitting || isCreating
                      ? "Recording Payment..."
                      : "Record Payment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className='border-t pt-4'>
        <div className='grid grid-cols-2 gap-4'>
          {invoiceData?.invoiceType === "single" ? (
            // Single Invoice: Show Student Payment Details
            pendingStudents.length > 0 && (
              <>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Fee Amount
                  </Label>
                  <p className='text-lg font-bold text-blue-600'>
                    ₦{invoiceData?.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Amount Paid
                  </Label>
                  <p className='text-lg font-bold text-green-600'>
                    ₦{pendingStudents[0].paid?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Outstanding
                  </Label>
                  <p className='text-lg font-bold text-red-600'>
                    ₦{pendingStudents[0].outstanding?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Status
                  </Label>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      pendingStudents[0].status === "paid"
                        ? "bg-green-100 text-green-800"
                        : pendingStudents[0].status === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pendingStudents[0].status}
                  </span>
                </div>
              </>
            )
          ) : (
            // Mass Invoice: Show Selected Student or Fee Amount
            <>
              <div className='col-span-2'>
                <Label className='text-sm font-medium text-gray-600'>
                  Fee Amount Per Student
                </Label>
                <p className='text-lg font-bold text-blue-600'>
                  ₦{invoiceData?.amount?.toLocaleString()}
                </p>
              </div>
              {paymentData.studentId &&
                (() => {
                  const selected = pendingStudents.find(
                    (s: any) => s.studentId === paymentData.studentId
                  );
                  return selected ? (
                    <>
                      <div>
                        <Label className='text-sm font-medium text-gray-600'>
                          Amount Paid
                        </Label>
                        <p className='text-lg font-bold text-green-600'>
                          ₦{selected.paid?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div>
                        <Label className='text-sm font-medium text-gray-600'>
                          Outstanding
                        </Label>
                        <p className='text-lg font-bold text-red-600'>
                          ₦{selected.outstanding?.toLocaleString()}
                        </p>
                      </div>
                    </>
                  ) : null;
                })()}
            </>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default CreateOfflinePaymentPage;
