import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { saveVault } from "../api";
import { encryptVault } from "../crypto";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";

function Vault({
  vault: [],
  vaultKey = "",
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vault",
  });

  const mutation = useMutation(saveVault);

  return (
    <FormWrapper
      onSubmit={handleSubmit(({ vault }) => {
        const encryptedVault = encryptVault({
          vault: JSON.stringify({ vault }),
          vaultKey,
        });

        window.sessionStorage.setItem("vault", JSON.stringify(vault));

        mutation.mutate(encryptedVault);
      })}
    >
      {fields.map((field, index) => {
        return (
          <Box
            key={field.id}
            display="flex"
            alignItems="flex-end"
            mt="4"
            mb="4"
          >
            <FormControl>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                type="url"
                id="website"
                placeholder="website"
                {...register(`Vault.${index}.website`, {
                  required: "Website is required",
                })}
              />
            </FormControl>
            <FormControl ml="2">
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                {...register(`Vault.${index}.username`, {
                  required: "Username is required",
                })}
              />
            </FormControl>
            <FormControl ml="2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...register(`Vault.${index}.password`, {
                  required: "Password is required",
                })}
              />
            </FormControl>

            <Button
              type="button"
              bg="red.500"
              color="white"
              fontSize="2xl"
              ml="2"
              onClick={() => remove(index)}
            >
              -
            </Button>
          </Box>
        );
      })}

      <Button
        onClick={() => append({ website: "", username: "", password: "" })}
      >
        Add
      </Button>

      <Button type="submit" color="teal" ml="8">
        Save Vault
      </Button>
    </FormWrapper>
  );
}

export default Vault;
