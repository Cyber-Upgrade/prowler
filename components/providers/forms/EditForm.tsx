"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress } from "@nextui-org/react";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateProvider } from "@/actions";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  alias: z.string(),
  providerId: z.string(),
});

export const EditForm = ({
  providerId,
  providerAlias,
  setIsOpen,
}: {
  providerId: string;
  providerAlias?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
    },
  });

  const { toast } = useToast();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(formData: FormData) {
    // client-side validation
    const data = await updateProvider(formData);

    if (data?.errors && data.errors.length > 0) {
      const error = data.errors[0];
      const errorMessage = `${error.detail}`;
      // show error
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Success!",
        description: "The provider was updated successfully.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        action={onSubmitClient}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <input type="hidden" name="id" value={providerId} />
        <div>Current alias: {providerAlias}</div>

        <CustomInput
          control={form.control}
          name="alias"
          type="text"
          label="Alias"
          placeholder={providerAlias}
        />

        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="bordered"
            disabled={isLoading}
            className="w-full hidden sm:block"
            type="button"
            onPress={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full"
            onPress={() => setIsOpen(false)}
          >
            {isLoading ? (
              <>
                <CircularProgress aria-label="Loading..." size="sm" />
                Saving...
              </>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
