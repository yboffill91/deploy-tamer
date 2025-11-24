"use client";
import {
  Button,
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui";
import { Plus } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { WordsContainer } from "./WordsContainer";

interface CustomKeywordInputProps<TForm extends FieldValues> {
  controlHandler: Control<TForm>;
  name: Path<TForm>;
  inputOnChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  inputHandleOnClick: () => void;
  emptyMessageWorldsContainer: string;
  onDeleteWorldsContainer: (value: string) => void;
  onClearWorldsContainer: () => void;
}

export const CustomKeywordInputComponent = <TForm extends FieldValues>({
  controlHandler,
  inputHandleOnClick,
  inputOnChangeValue,
  inputValue,
  name,
  emptyMessageWorldsContainer,
  onClearWorldsContainer,
  onDeleteWorldsContainer,
}: CustomKeywordInputProps<TForm>) => {
  return (
    <>
      <InputGroup>
        <InputGroupInput
          placeholder="Enter a keyword"
          onChange={inputOnChangeValue}
          value={inputValue}
        />
        <InputGroupButton className="p-0" asChild>
          <Button
            size="icon"
            className="text-xs font-medium"
            variant={"ghost"}
            onClick={inputHandleOnClick}
          >
            <Plus />
          </Button>
        </InputGroupButton>
      </InputGroup>

      <Controller
        control={controlHandler}
        name={name}
        render={({ field }) => (
          <WordsContainer
            message={emptyMessageWorldsContainer}
            list={field.value as string[]}
            onDelete={onDeleteWorldsContainer}
            onClear={onClearWorldsContainer}
          />
        )}
      />
    </>
  );
};
