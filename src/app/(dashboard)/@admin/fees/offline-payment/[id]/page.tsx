"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOfflinePaymentByIdQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Check, X, Eye } from "lucide-react";
import Image from "next/image";

const ViewOfflinePaymentPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;
  const [showFullImage, setShowFullImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch offline payment data
  const {
    data: paymentData,
    isLoading,
    error,
  } = useGetOfflinePaymentByIdQuery(paymentId);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // API call to approve payment
      console.log("Approving payment:", paymentId);
      // await approveOfflinePaymentMutation(paymentId);
      alert("Payment approved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Failed to approve payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    setIsProcessing(true);
    try {
      // API call to reject payment
      console.log("Rejecting payment:", paymentId, "Reason:", reason);
      // await rejectOfflinePaymentMutation({ id: paymentId, reason });
      alert("Payment rejected successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Failed to reject payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    console.log("Downloading receipt for payment:", paymentId);
    alert("Receipt download will be implemented");
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error || !paymentData) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Payment Not Found
          </h1>
          <p className='text-gray-600 mb-4'>
            The offline payment could not be found.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className='bg-green-100 text-green-800'>Approved</Badge>;
      case "pending":
        return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>;
      case "rejected":
        return <Badge className='bg-red-100 text-red-800'>Rejected</Badge>;
      default:
        return <Badge className='bg-gray-100 text-gray-800'>{status}</Badge>;
    }
  };

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
            <h1 className='text-2xl font-bold'>Offline Payment Details</h1>
            <p className='text-gray-600'>Payment ID: {paymentId}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2'>
          {paymentData.status === "pending" && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className='bg-green-600 hover:bg-green-700'
              >
                <Check className='h-4 w-4 mr-2' />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant='destructive'
              >
                <X className='h-4 w-4 mr-2' />
                Reject
              </Button>
            </>
          )}
          {paymentData.status === "approved" && (
            <Button onClick={handleDownloadReceipt}>
              <Download className='h-4 w-4 mr-2' />
              Download Receipt
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Payment Information */}
        <div className='space-y-6'>
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Payment Information
                {getStatusBadge(paymentData.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Student Name
                  </Label>
                  <p className='font-semibold'>{paymentData.studentName}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Class
                  </Label>
                  <p className='font-semibold'>{paymentData.class}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Invoice Reference
                  </Label>
                  <p className='font-semibold'>{paymentData.invoiceNumber}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Amount Paid
                  </Label>
                  <p className='text-lg font-bold text-blue-600'>
                    ₦{paymentData.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Generated By
                  </Label>
                  <p className='font-semibold'>{paymentData.generatedBy}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Created On
                  </Label>
                  <p className='font-semibold'>
                    {new Date(paymentData.createdOn).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              {paymentData.notes && (
                <div className='border-t pt-4'>
                  <Label className='text-sm font-medium text-gray-600'>
                    Payment Notes
                  </Label>
                  <p className='mt-1 text-gray-700'>{paymentData.notes}</p>
                </div>
              )}

              {paymentData.rejectionReason && (
                <div className='border-t pt-4'>
                  <Label className='text-sm font-medium text-red-600'>
                    Rejection Reason
                  </Label>
                  <p className='mt-1 text-red-700'>
                    {paymentData.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Related Invoice</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Invoice Total
                  </Label>
                  <p className='font-semibold'>
                    ₦{paymentData.invoice?.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Amount Paid (Before)
                  </Label>
                  <p className='font-semibold text-green-600'>
                    ₦{paymentData.invoice?.previouslyPaid?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    This Payment
                  </Label>
                  <p className='font-semibold text-blue-600'>
                    ₦{paymentData.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Outstanding
                  </Label>
                  <p className='font-semibold text-red-600'>
                    ₦
                    {(
                      (paymentData.invoice?.totalAmount || 0) -
                      (paymentData.invoice?.previouslyPaid || 0) -
                      paymentData.amount
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Proof */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Proof</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentData.paymentProofUrl ? (
              <div className='space-y-4'>
                <div className='relative w-full h-96 border rounded-lg overflow-hidden bg-gray-50'>
                  <Image
                    src={paymentData.paymentProofUrl}
                    alt='Payment proof'
                    fill
                    className='object-contain'
                  />
                </div>

                <div className='flex justify-center space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => setShowFullImage(true)}
                    className='flex items-center space-x-2'
                  >
                    <Eye className='h-4 w-4' />
                    <span>View Full Size</span>
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = paymentData.paymentProofUrl;
                      link.download = `payment-proof-${paymentId}`;
                      link.click();
                    }}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p>No payment proof available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Size Image Modal */}
      {showFullImage && paymentData.paymentProofUrl && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
          onClick={() => setShowFullImage(false)}
        >
          <div className='max-w-4xl max-h-full p-4'>
            <Image
              src={paymentData.paymentProofUrl}
              alt='Payment proof - Full size'
              width={800}
              height={600}
              className='max-w-full max-h-full object-contain'
            />
            <Button
              className='absolute top-4 right-4 bg-white text-black'
              onClick={() => setShowFullImage(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOfflinePaymentPage;
