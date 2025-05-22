// components/SubscriptionAssignmentForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useGetSchoolsQuery, useAssignSubscriptionMutation } from "@/redux/api";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import NoData from "../NoData";

// Form schema
const assignmentSchema = z.object({
  schoolId: z.string().min(1, "Please select a school"),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface SubscriptionAssignmentFormProps {
  subscriptionId: string;
  onSuccess: () => void;
}

export default function SubscriptionAssignmentForm({
  subscriptionId,
  onSuccess,
}: SubscriptionAssignmentFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetSchoolsQuery({
    search: debouncedSearchTerm,
    page,
    limit: 5,
  });

  const schools = useMemo(() => data?.schools || [], [data?.schools]);
  const total = data?.total || 0;
  const hasMore = page * 5 < total;

  const [
    assignSubscription,
    { isLoading: isAssigning, isSuccess, isError, error },
  ] = useAssignSubscriptionMutation();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      schoolId: "",
    },
  });

  const onSubmit = async (values: AssignmentFormData) => {
    try {
      await assignSubscription({
        schoolId: values.schoolId,
        subscriptionId,
      }).unwrap();
    } catch (error) {
      console.error("Assign subscription error:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Success", {
        description: "Subscription assigned successfully",
      });
      form.reset();
      onSuccess();
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { error?: string })?.error
          : "Failed to assign subscription";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  }, [isSuccess, isError, error, form, onSuccess]);

  return (
    <div className='w-full max-w-md space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search schools...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
              disabled={isLoading || isFetching}
            />
          </div>

          {/* <Command>
            <CommandInput
              placeholder='Search schools...'
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {schools.map((school) => (
                <CommandItem
                  key={school.id}
                  value={school.id}
                  onSelect={() => form.setValue("schoolId", school.id)}
                >
                  {school.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command> */}

          {/* School List */}
          <FormField
            control={form.control}
            name='schoolId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700'>Select School</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className='space-y-2'
                    disabled={isLoading || isFetching || isAssigning}
                  >
                    <ScrollArea className='h-[300px] rounded-md border p-2'>
                      {isLoading || isFetching ? (
                        <div className='flex justify-center p-4'>
                          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
                        </div>
                      ) : schools.length > 0 ? (
                        schools.map((school) => (
                          <div
                            key={school.id}
                            className='flex items-center gap-2 p-2 rounded-lg hover:bg-accent border mb-2'
                          >
                            <RadioGroupItem value={school.id} id={school.id} />
                            <div className='flex size-6 items-center justify-center rounded-sm border'>
                              <Image
                                src={
                                  school?.logo?.url
                                    ? school?.logo?.url
                                    : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                                        school.name
                                      )}`
                                }
                                alt=''
                                className='size-4 object-cover'
                                width={16}
                                height={16}
                              />
                            </div>
                            <div className='flex-1'>
                              <div className='font-medium'>{school.name}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <NoData text='No schools without subscriptions found' />
                      )}
                      {hasMore && (
                        <Button
                          variant='outline'
                          className='w-full mt-2'
                          onClick={() => setPage((prev) => prev + 1)}
                          disabled={isFetching}
                        >
                          {isFetching && (
                            <Loader2 className='animate-spin w-4 h-4' />
                          )}
                          {isFetching ? "Loading..." : "Load More"}
                        </Button>
                      )}
                    </ScrollArea>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isLoading || isFetching || isAssigning}
            className='w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90'
          >
            {isAssigning ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <span>Assign Subscription</span>
                <ArrowRight className='h-5 w-5' />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
