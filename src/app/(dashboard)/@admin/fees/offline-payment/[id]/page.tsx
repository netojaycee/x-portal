"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetOfflinePaymentByIdQuery,
  useProcessOfflinePaymentMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Check, X, Eye } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import ApprovalForm from "../(components)/ApprovalForm";
import RejectionForm from "../(components)/RejectionForm";
import { ENUM_MODULES } from "@/lib/types/enums";

const ViewOfflinePaymentPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;
  const [showFullImage, setShowFullImage] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [processOfflinePayment] = useProcessOfflinePaymentMutation();

  // Fetch offline payment data
  const {
    data: paymentData,
    isLoading,
    error,
  } = useGetOfflinePaymentByIdQuery(paymentId);

  console.log(paymentData, "paymentdata");

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await processOfflinePayment({
        id: paymentId,
        approve: true,
      }).unwrap();
      toast.success("Payment approved successfully!");
      router.refresh();
      setShowApproveModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsProcessing(true);
    try {
      await processOfflinePayment({
        id: paymentId,
        approve: false,
        rejectionReason: reason,
      }).unwrap();
      toast.success("Payment rejected successfully!");
      router.refresh();
      setShowRejectModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject payment.");
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
      <div className='flex md:flex-row flex-col md:items-center items-start justify-between mb-6 space-y-4'>
        <div className='flex flex-col md:flex-row md:items-center items-start space-x-4 space-y-3'>
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='flex items-center space-x-2'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back</span>
          </Button>
          <div>
            <h1 className='text-xl font-bold'>Offline Payment Details</h1>
            {/* <p className='text-gray-600'>Payment ID: {paymentId}</p> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2'>
          {paymentData.status === "pending" && (
            <>
              <Button
                onClick={() => setShowApproveModal(true)}
                disabled={isProcessing}
                className='bg-green-600 hover:bg-green-700'
              >
                <Check className='h-4 w-4 mr-2' />
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
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
                  <p className='font-semibold'>{`${paymentData.student.user.firstname} ${paymentData.student.user.lastname}`}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Class
                  </Label>
                  <p className='font-semibold'>{`${paymentData.student.class.name} ${paymentData.student.classArm.name}`}</p>
                </div>
                {/* <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Invoice Reference
                  </Label>
                  <p className='font-semibold'>{paymentData.invoice.reference}</p>
                </div> */}
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
                  <p className='font-semibold'>{`${paymentData.createdByUser.firstname} ${paymentData.createdByUser.lastname}`}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Created On
                  </Label>
                  <p className='font-semibold'>
                    {new Date(paymentData.createdAt).toLocaleDateString(
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
                    ₦{paymentData.invoice?.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Term/Session
                  </Label>
                  <p className='font-semibold text-green-600'>
                    {`${paymentData.invoice?.term?.name} - ${paymentData.invoice?.session?.name}`}
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
            {paymentData.proofOfPayment ? (
              <div className='space-y-4'>
                <div className='relative w-full h-96 border rounded-lg overflow-hidden bg-gray-50'>
                  <Image
                    src={paymentData.proofOfPayment}
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
                      // Convert base64 to blob
                      const base64Response = fetch(paymentData.proofOfPayment);
                      base64Response
                        .then((res) => res.blob())
                        .then((blob) => {
                          const blobUrl = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = blobUrl;
                          link.download = `payment-proof-${paymentId}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(blobUrl);
                        });
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
      {showFullImage && paymentData.proofOfPayment && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
          onClick={() => setShowFullImage(false)}
        >
          <div className='max-w-4xl max-h-[90vh] p-4'>
            <Image
              src={paymentData.proofOfPayment}
              alt='Payment proof - Full size'
              width={400}
              height={200}
              className='max-w-[90vw] max-h-[90vh] object-contain'
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

      {/* Approval Modal */}
      <CustomModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        type={ENUM_MODULES.OFFLINE_PAYMENT}
        status='approve'
        title='Approve Offline Payment'
        description='Are you sure you want to approve this offline payment?'
      >
        <ApprovalForm
          paymentId={paymentId}
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApprove}
          isProcessing={isProcessing}
        />
      </CustomModal>

      {/* Rejection Modal */}
      <CustomModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        type={ENUM_MODULES.OFFLINE_PAYMENT}
        status='reject'
        title='Reject Offline Payment'
        description='Please provide a reason for rejecting this payment.'
      >
        <RejectionForm
          paymentId={paymentId}
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      </CustomModal>
    </div>
  );
};

export default ViewOfflinePaymentPage;
