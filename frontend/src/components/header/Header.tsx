import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";


const schema = yup.object().shape({
  firstName: yup.string().required("First name is required").max(30, "Max 30 characters"),
  lastName: yup.string().required("Last name is required").max(30, "Max 30 characters"),
  participation: yup
    .string()
    .trim()
    .required("Participation is required")
    .matches(/^\d+$/, "Participation must be a number")
    .test("min", "Minimum value is 1", value => Number(value) >= 1)
    .test("max", "Maximum value is 100", value => Number(value) <= 100),
});


type FormData = {
  firstName: string;
  lastName: string;
  participation: string;
};

const Header = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("https://backend-1-9yab.onrender.com/participants", {
        firstName: data.firstName,
        lastName: data.lastName,
        participation: parseInt(data.participation, 10),
      });
      console.log("Success:", response.data);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting form:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
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
          className="bg-transparent text-white font-bold py-2 px-8 rounded border border-white hover:bg-white hover:text-[#00BFEA] text-base"
        >
          SEND
        </button>
      </form>
    </div>
  );
};

export default Header;

