"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import {
  useCreateSubscriptionPaymentMutation,
  // useVerifyPaymentMutation,
} from "@/redux/api";

// Form schema
const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .length(3, "CVV must be 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  cardHolderName: z.string().min(3, "Cardholder name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CustomCheckoutProps {
  packageId: string;
  packageName: string;
  packagePrice: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomCheckout({
  packageId,
  packageName,
  packagePrice,
  onSuccess,
  onCancel,
}: CustomCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createSubscriptionPayment] = useCreateSubscriptionPaymentMutation();
  // const [verifyPayment] = useVerifyPaymentMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: "",
      email: "",
    },
  });

  const handleExpiryDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      form.setValue("expiryDate", value);
    } else if (value.length > 2) {
      form.setValue("expiryDate", `${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      // Create payment request with custom checkout flow
      const paymentResult = await createSubscriptionPayment({
        packageId,
        // email: data.email,
        // customCheckout: true, // Flag to indicate we're using custom checkout
        // paymentMethod: "card",
        // cardDetails: {
        //   number: data.cardNumber.replace(/\s/g, ""),
        //   expiryMonth: data.expiryDate.split("/")[0],
        //   expiryYear: `20${data.expiryDate.split("/")[1]}`,
        //   cvv: data.cvv,
        //   name: data.cardHolderName,
        // },
      }).unwrap();

      // Backend will handle the actual payment processing with Paystack SDK
      // We just need to check the response
      if (paymentResult.success || paymentResult.reference) {
        toast.success("Payment successful!");
        onSuccess();
      } else {
        const errorMessage =
          paymentResult.message || "Payment processing failed";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.data?.message || "Payment failed. Please try again.";
      toast.error(errorMessage);
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Checkout</CardTitle>
        <div className='flex items-center text-sm text-gray-500'>
          <Lock className='mr-2 h-4 w-4' />
          <span>Secure Payment</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='font-medium'>Package:</span>
            <span>{packageName}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Amount:</span>
            <span className='font-bold'>₦{packagePrice.toLocaleString()}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='cardHolderName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Smith' {...field} />
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
                      placeholder='you@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cardNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='1234 5678 9012 3456'
                      maxLength={19}
                      {...field}
                      onChange={(e) => {
                        // Remove non-digits and format the card number
                        const value = e.target.value.replace(/\D/g, "");
                        const formatted =
                          value.match(/.{1,4}/g)?.join(" ") || value;
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='expiryDate'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='MM/YY'
                        maxLength={5}
                        {...field}
                        onChange={(e) => {
                          handleExpiryDateInput(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='cvv'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='123'
                        maxLength={3}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex gap-4 pt-2'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type='submit' className='flex-1' disabled={isProcessing}>
                {isProcessing ? (
                  <div className='flex items-center'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ₦${packagePrice.toLocaleString()}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
