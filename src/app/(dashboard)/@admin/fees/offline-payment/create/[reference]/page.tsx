"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoiceByCodeQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowLeft, FileImage } from "lucide-react";
import Image from "next/image";

const CreateOfflinePaymentPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  //   const reference = params.reference as string;

  const reference = Array.isArray(params?.reference)
    ? params.reference[0]
    : params?.reference;

  const decodedReference = reference ? decodeURIComponent(reference) : "";

  const [paymentData, setPaymentData] = useState({
    amount: "",
    notes: "",
    paymentProof: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setPaymentData((prev) => ({ ...prev, paymentProof: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.amount) {
      alert("Please enter the payment amount");
      return;
    }

    if (!paymentData.paymentProof) {
      alert("Please upload payment proof");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically upload the file and create the offline payment
      // For now, we'll just simulate the process
      console.log("Creating offline payment:", {
        invoiceReference: decodedReference,
        amount: paymentData.amount,
        notes: paymentData.notes,
        paymentProof: paymentData.paymentProof.name,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Offline payment recorded successfully!");
      router.push("/admin/fees");
    } catch (error) {
      console.error("Error creating offline payment:", error);
      alert("Failed to record offline payment. Please try again.");
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
            <h1 className='text-2xl font-bold'>Record Offline Payment</h1>
            <p className='text-gray-600'>Invoice Reference: {reference}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Reference
                </Label>
                <p className='font-semibold'>{invoiceData.reference}</p>
              </div>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Student
                </Label>
                <p className='font-semibold'>{invoiceData.studentName}</p>
              </div>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Class
                </Label>
                <p className='font-semibold'>{invoiceData.class}</p>
              </div>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Session
                </Label>
                <p className='font-semibold'>{invoiceData.session}</p>
              </div>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Term
                </Label>
                <p className='font-semibold'>{invoiceData.term}</p>
              </div>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Due Date
                </Label>
                <p className='font-semibold'>{invoiceData.dueDate}</p>
              </div>
            </div>

            <div className='border-t pt-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Total Amount
                  </Label>
                  <p className='text-lg font-bold text-blue-600'>
                    ₦{invoiceData.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Amount Paid
                  </Label>
                  <p className='text-lg font-bold text-green-600'>
                    ₦{invoiceData.amountPaid?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Outstanding
                  </Label>
                  <p className='text-lg font-bold text-red-600'>
                    ₦
                    {(
                      invoiceData.totalAmount - invoiceData.amountPaid
                    )?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Status
                  </Label>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      invoiceData.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoiceData.status === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {invoiceData.status}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label htmlFor='amount'>Payment Amount *</Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Enter amount paid'
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className='mt-1'
                  required
                  max={invoiceData.totalAmount - invoiceData.amountPaid}
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Maximum amount: ₦
                  {(
                    invoiceData.totalAmount - invoiceData.amountPaid
                  )?.toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor='notes'>Payment Notes</Label>
                <Textarea
                  id='notes'
                  placeholder='Add any additional notes about this payment...'
                  value={paymentData.notes}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className='mt-1'
                  rows={3}
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
                          <span className='font-semibold'>Click to upload</span>{" "}
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
                      <div className='mt-2 relative w-full h-48 border rounded-lg overflow-hidden'>
                        <Image
                          src={previewUrl}
                          alt='Payment proof preview'
                          fill
                          className='object-contain'
                        />
                      </div>
                      <p className='text-sm text-gray-500 mt-2 flex items-center'>
                        <FileImage className='h-4 w-4 mr-1' />
                        {paymentData.paymentProof?.name}
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
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? "Recording Payment..." : "Record Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOfflinePaymentPage;
