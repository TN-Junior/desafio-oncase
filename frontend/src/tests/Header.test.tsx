import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/header/Header"; 

describe("Header Form Validation", () => {
  test("renders input fields and button", () => {
    render(<Header />);

    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Participation")).toBeInTheDocument();
    expect(screen.getByText("SEND")).toBeInTheDocument();
  });

  test("displays error messages when trying to submit empty fields", async () => {
    render(<Header />);

    fireEvent.click(screen.getByText("SEND"));

    expect(await screen.findByText("First name is required")).toBeInTheDocument();
    expect(await screen.findByText("Last name is required")).toBeInTheDocument();
    expect(await screen.findByText("Participation is required")).toBeInTheDocument(); 
  });

  test("displays an error if Participation is not a number", async () => {
    render(<Header />);

    userEvent.type(screen.getByPlaceholderText("Participation"), "abc");
    fireEvent.click(screen.getByText("SEND"));

    expect(await screen.findByText("Participation must be a number")).toBeInTheDocument();
  });

  test("displays an error if Participation is out of range (below 1)", async () => {
    render(<Header />);

    userEvent.clear(screen.getByPlaceholderText("Participation"));
    userEvent.type(screen.getByPlaceholderText("Participation"), "0");
    fireEvent.click(screen.getByText("SEND"));

    expect(await screen.findByText("Minimum value is 1")).toBeInTheDocument();
  });

  test("displays an error if Participation is out of range (above 100)", async () => {
    render(<Header />);

    userEvent.clear(screen.getByPlaceholderText("Participation"));
    userEvent.type(screen.getByPlaceholderText("Participation"), "101");
    fireEvent.click(screen.getByText("SEND"));

    expect(await screen.findByText("Maximum value is 100")).toBeInTheDocument();
  });

  test("submits the form when valid data is entered", async () => {
    render(<Header />);

    userEvent.clear(screen.getByPlaceholderText("First name"));
    userEvent.type(screen.getByPlaceholderText("First name"), "Jon");

    userEvent.clear(screen.getByPlaceholderText("Last name"));
    userEvent.type(screen.getByPlaceholderText("Last name"), "Goes");

    userEvent.clear(screen.getByPlaceholderText("Participation"));
    userEvent.type(screen.getByPlaceholderText("Participation"), "50");

    fireEvent.click(screen.getByText("SEND"));

    expect(screen.queryByText("First name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Last name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Participation is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Participation must be a number")).not.toBeInTheDocument();
    expect(screen.queryByText("Minimum value is 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Maximum value is 100")).not.toBeInTheDocument();
  });
});
