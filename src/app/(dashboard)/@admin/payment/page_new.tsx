"use client";
import React, { useState } from "react";
import { ChevronLeft, Check, AlertTriangle, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetSubscriptionPackagesQuery,
  useCreateSubscriptionPaymentMutation,
  useGetCurrentSubscriptionQuery,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import CustomCheckout from "./(components)/CustomCheckout";
import { SubscriptionPackage } from "@/lib/types";

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showCustomCheckout, setShowCustomCheckout] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] =
    useState<SubscriptionPackage | null>(null);

  // RTK Query hooks
  const {
    data: packagesData,
    isLoading: packagesLoading,
    error: packagesError,
  } = useGetSubscriptionPackagesQuery({});
  const {
    data: currentSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useGetCurrentSubscriptionQuery();
  const [createSubscriptionPayment] = useCreateSubscriptionPaymentMutation();

  const handleSelectPackage = (packageId: string) => {
    const currentPkg = currentSubscription;

    // Check if user is trying to select their current active package
    if (
      currentPkg?.packageId === packageId &&
      currentPkg?.isActive &&
      !currentPkg?.isExpired
    ) {
      toast.error("You are already subscribed to this package");
      return;
    }

    setSelectedPackage(packageId);

    // Find the package details
    const selectedPkg = packagesData?.find(
      (pkg: SubscriptionPackage) => pkg.id === packageId
    );
    if (selectedPkg) {
      setSelectedPackageDetails(selectedPkg);
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      toast.error("Please select a subscription package");
      return;
    }

    try {
      setIsProcessing(true);

      // Check if this is an extension of current plan
      const isExtension =
        currentSubscription?.packageId === selectedPackage &&
        currentSubscription?.isActive;

      const result = await createSubscriptionPayment({
        packageId: selectedPackage,
        isExtension,
      }).unwrap();

      // Redirect to the Paystack payment page
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        toast.error("Could not initialize payment");
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || "Failed to process payment";
      toast.error(errorMessage);
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomCheckout = () => {
    if (!selectedPackage) {
      toast.error("Please select a subscription package");
      return;
    }
    setShowCustomCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    toast.success("Payment successful!");
    setShowCustomCheckout(false);
    // Redirect to success page
    window.location.href =
      "/payment/success?reference=custom_checkout_" + Date.now();
  };

  const handleCheckoutCancel = () => {
    setShowCustomCheckout(false);
  };

  // Loading state
  if (packagesLoading || subscriptionLoading) {
    return <LoaderComponent />;
  }

  // Error state
  if (packagesError || subscriptionError) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-lg font-semibold mb-2'>Error Loading Data</h2>
          <p className='text-gray-600 mb-4'>
            {packagesError
              ? "Failed to load subscription packages"
              : "Failed to load current subscription"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const subscriptionPackages = packagesData || [];
  const currentSubscriptionInfo = currentSubscription;

  const canSelectPackage = (pkg: SubscriptionPackage) => {
    // If no current subscription, allow all packages
    if (!currentSubscriptionInfo) return true;

    // If current subscription is expired, allow all packages
    if (currentSubscriptionInfo.isExpired) return true;

    // If current subscription is active but different package, don't allow
    if (
      currentSubscriptionInfo.isActive &&
      currentSubscriptionInfo.packageId !== pkg.id
    ) {
      return false;
    }

    // If same package and active, allow for extension
    if (
      currentSubscriptionInfo.packageId === pkg.id &&
      currentSubscriptionInfo.isActive
    ) {
      return currentSubscriptionInfo.canExtend;
    }

    return true;
  };

  const getButtonText = (pkg: SubscriptionPackage) => {
    if (!currentSubscriptionInfo) {
      return selectedPackage === pkg.id ? "Selected" : "Select Plan";
    }

    if (
      currentSubscriptionInfo.packageId === pkg.id &&
      currentSubscriptionInfo.isActive
    ) {
      if (currentSubscriptionInfo.canExtend) {
        return selectedPackage === pkg.id
          ? "Selected for Extension"
          : "Extend Plan";
      }
      return "Current Plan";
    }

    if (
      currentSubscriptionInfo.isActive &&
      currentSubscriptionInfo.packageId !== pkg.id
    ) {
      return "Unavailable";
    }

    return selectedPackage === pkg.id ? "Selected" : "Select Plan";
  };

  return (
    <div className='space-y-4'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/dashboard' className='text-primary'>
            Dashboard
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Subscription & Payment</p>
      </div>

      {/* Header */}
      <div>
        <h1 className='text-2xl font-semibold'>Subscription Packages</h1>
        <p className='text-gray-500 mt-1'>
          Choose a subscription plan that fits your school&apos;s needs
        </p>
      </div>

      {/* Current Subscription Info */}
      {currentSubscriptionInfo && (
        <Card className='bg-blue-50 border-blue-200'>
          <CardHeader>
            <CardTitle className='text-lg'>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-lg'>
                  {currentSubscriptionInfo.packageName || "Unknown Package"}
                </p>
                <p className='text-sm text-gray-600'>
                  Expires:{" "}
                  {new Date(
                    currentSubscriptionInfo.expiresAt
                  ).toLocaleDateString()}
                </p>
                {currentSubscriptionInfo.daysRemaining > 0 && (
                  <p className='text-sm text-amber-600'>
                    {currentSubscriptionInfo.daysRemaining} days remaining
                  </p>
                )}
              </div>
              <div className='flex flex-col items-end gap-2'>
                <Badge
                  variant={
                    currentSubscriptionInfo.isActive &&
                    !currentSubscriptionInfo.isExpired
                      ? "default"
                      : "destructive"
                  }
                >
                  {currentSubscriptionInfo.isActive &&
                  !currentSubscriptionInfo.isExpired
                    ? "Active"
                    : "Expired"}
                </Badge>
                {currentSubscriptionInfo.canExtend && (
                  <Badge variant='outline' className='text-xs'>
                    Can Extend
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Packages */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {subscriptionPackages.map((pkg: SubscriptionPackage) => {
          const isCurrentPackage =
            currentSubscriptionInfo?.packageId === pkg.id;
          const canSelect = canSelectPackage(pkg);
          const isActiveCurrentPackage =
            isCurrentPackage &&
            currentSubscriptionInfo?.isActive &&
            !currentSubscriptionInfo?.isExpired;

          return (
            <Card
              key={pkg.id}
              className={`
                flex flex-col
                ${isCurrentPackage ? "border-primary ring-1 ring-primary" : ""}
                ${pkg.isPopular ? "shadow-lg" : ""}
                ${!canSelect ? "opacity-60" : ""}
              `}
            >
              {pkg.isPopular && (
                <div className='bg-primary text-white text-center py-1 text-xs font-medium'>
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  {pkg.name}
                  {isCurrentPackage && (
                    <Badge variant='outline' className='text-xs'>
                      Current
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{pkg.validity} days validity</CardDescription>
                <div className='mt-2'>
                  <span className='text-3xl font-bold'>
                    ₦{pkg.price && pkg.price.toLocaleString()}
                  </span>
                  {pkg.studentLimit && (
                    <p className='text-sm text-gray-500 mt-1'>
                      Up to {pkg.studentLimit} students
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className='flex-grow'>
                <h4 className='font-medium mb-2'>Features:</h4>
                <ul className='space-y-2'>
                  {pkg.features.map((feature: any, index: number) => (
                    <li key={index} className='flex items-center'>
                      <Check className='h-4 w-4 text-green-500 mr-2' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full ${
                    selectedPackage === pkg.id ? "bg-primary" : "bg-secondary"
                  }`}
                  disabled={!canSelect || isActiveCurrentPackage}
                >
                  {getButtonText(pkg)}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Payment Action */}
      <div className='flex justify-end mt-6 gap-4'>
        <Button
          variant='outline'
          onClick={handleCustomCheckout}
          disabled={!selectedPackage || isProcessing || showCustomCheckout}
          size='lg'
        >
          <CreditCard className='mr-2 h-4 w-4' />
          Use Custom Checkout
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!selectedPackage || isProcessing || showCustomCheckout}
          size='lg'
        >
          {isProcessing
            ? "Processing..."
            : currentSubscriptionInfo?.packageId === selectedPackage
            ? "Extend Subscription"
            : "Subscribe Now"}
        </Button>
      </div>

      {/* Payment Info */}
      {!showCustomCheckout && (
        <Card className='mt-4 bg-amber-50 border-amber-200'>
          <CardHeader className='flex flex-row items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            <CardTitle className='text-lg'>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>
              This payment will be processed securely through Paystack. After
              successful payment, your subscription will be automatically
              activated. For any payment issues, please contact support.
            </p>
            {currentSubscriptionInfo?.isActive &&
              selectedPackage &&
              currentSubscriptionInfo?.packageId !== selectedPackage && (
                <div className='mt-2 p-2 bg-amber-100 rounded text-sm'>
                  <strong>Note:</strong> You currently have an active
                  subscription. Subscribing to a different package will replace
                  your current plan.
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Custom Checkout */}
      {showCustomCheckout && selectedPackageDetails && (
        <div className='mt-8'>
          <CustomCheckout
            packageId={selectedPackageDetails.id}
            packageName={selectedPackageDetails.name}
            packagePrice={selectedPackageDetails.price!}
            onSuccess={handleCheckoutSuccess}
            onCancel={handleCheckoutCancel}
          />
        </div>
      )}
    </div>
  );
}
