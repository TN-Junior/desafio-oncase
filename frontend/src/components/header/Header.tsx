import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createParticipant } from "../../services/api";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required").max(30, "Max 30 characters"),
  lastName: yup.string().required("Last name is required").max(30, "Max 30 characters"),
  participation: yup
    .string()
    .trim()
    .required("Participation is required")
    .matches(/^\d+$/, "Participation must be a number")
    .test("min", "Minimum value is 1", (value) => Number(value) >= 1)
    .test("max", "Maximum value is 100", (value) => Number(value) <= 100),
});

type FormData = {
  firstName: string;
  lastName: string;
  participation: string;
};

const Header = ({ refreshParticipants }: { refreshParticipants: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await createParticipant({
        firstName: data.firstName,
        lastName: data.lastName,
        participation: parseInt(data.participation, 10),
      });

      refreshParticipants(); // Atualiza sem recarregar a página
      reset(); // Limpa o formulário após o envio
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#00BFEA] py-6 flex justify-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-x-6 max-w-screen-lg w-full justify-center"
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="First name"
            {...register("firstName")}
            className={`p-2 border rounded-md outline-none w-64 text-base ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Last name"
            {...register("lastName")}
            className={`p-2 border rounded-md outline-none w-64 text-base ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Participation"
            {...register("participation")}
            className={`p-2 border rounded-md outline-none w-64 text-base ${
              errors.participation ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.participation && <span className="text-red-500 text-sm">{errors.participation.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-transparent text-white font-bold py-2 px-8 rounded border border-white hover:bg-white hover:text-[#00BFEA] text-base flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8H4z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            "SEND"
          )}
        </button>
      </form>
    </div>
  );
};

export default Header;
