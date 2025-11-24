"use client";
import {
  Badge,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from "@/components/ui";
import {
  Bell,
  Bot,
  CircleOff,
  Focus,
  Globe,
  Globe2,
  Languages,
  MapPin,
  Search,
  Send,
  Tag,
  Tags,
  Target,
  Video,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
import { CustomCard } from "@/components/CustomCard";
import { WordsContainer } from "./WordsContainer";
import { Controller, useForm } from "react-hook-form";
import {
  KeywordResearchSchema,
  KeywordResearchFormType,
} from "../utils/models";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { KeywordResearchDTO } from "@/core/dto";
import { CustomControllerInput } from "@/components/CustomControllerInput";
import { useEffect, useState } from "react";
import { ControlledDialog } from "@/components/ControlledDialog";
import { BrandsEntity, CitiesEntity, CountriesEntity } from "@/core/entities";
import { showToast } from "@/components/CustomToaster";
import {
  BrandApiRepository,
  CitiesRepository,
} from "@/infrastructure/repositories";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomKeywordInputComponent } from "./CustomKeywordInputComponent";
import { RegionSelector } from "./CustomRegionSelector";

type fieldsType = Pick<
  KeywordResearchDTO,
  | "brand"
  | "city"
  | "negativeKeywords"
  | "extraPositiveKeywords"
  | "generatedNegativeKeywords"
  | "generatedPositiveKeywords"
  | "region"
  | "positiveKeywords"
>;
export const KeyWordResearchComponents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brands, setBrands] = useState<BrandsEntity[] | null>(null);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [allRegions, setAllRegions] = useState<CountriesEntity[] | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [availablesCities, serAvailablesCities] = useState<
    CitiesEntity[] | null
  >(null);

  interface temporalsWordsState {
    positive: string;
    negative: string;
    extraPositive: string;
  }
  const [temporalWord, setTemporalWord] = useState<{
    positive: string;
    negative: string;
    extraPositive: string;
  }>({
    positive: "",
    negative: "",
    extraPositive: "",
  });

  //  -----------------------------------------------------------------------tipos
  type KeywordResearchFormInput = z.input<typeof KeywordResearchSchema>;

  // ------------------------------------------------inicializacion de formulario

  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<KeywordResearchFormInput>({
    resolver: zodResolver(KeywordResearchSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      searchVolume: "",

      positiveKeywords: [],
      negativeKeywords: [],
      extraPositiveKeywords: [],
      city: [],
      generatedPositiveKeywords: [],
      generatedNegativeKeywords: [],
      region: [],
      brand: [],

      allCitys: false,
      requestLanguage: "EN",
      type: "TRANSACTIONAL",
      companyId: 0,
    },
  });

  const negativeKeywords = watch("negativeKeywords");
  const extraPositiveKeywords = watch("extraPositiveKeywords");
  const city = watch("city");
  const generatedPositiveKeywords = watch("generatedPositiveKeywords");
  const generatedNegativeKeywords = watch("generatedNegativeKeywords");
  const region = watch("region");
  const brand = watch("brand");
  const positiveKeywords = watch("positiveKeywords");

  //  ----------------------------------------------------------------handlers

  const handleAdd = (fieldName: keyof fieldsType, newWord: string) => {
    const current = getValues(fieldName) || [];

    const normalized = newWord.trim().toLowerCase();
    if (!normalized) return;

    if (current.includes(normalized)) {
      showToast({
        type: "error",
        message: "Error",
        description: "Value already exists",
      });
      return;
    }

    setValue(fieldName, [...current, normalized], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTemporalWord = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: keyof temporalsWordsState
  ) => {
    setTemporalWord({
      ...temporalWord,
      [position]: e.target.value,
    });
  };

  const handleDelete = (fieldName: keyof fieldsType, wordToDelete: string) => {
    const current = getValues(fieldName) || [];
    const updated = current.filter((word) => word !== wordToDelete);
    setValue(fieldName, updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleReset = (name: keyof KeywordResearchFormType) => {
    setValue(name, []);
  };

  // ----------------------------------------------------------------Efectos
  useEffect(() => {
    if (isError) {
      showToast({
        description: isError,
        message: "Error",
        type: "error",
      });
    }
  }, [isError]);

  useEffect(() => {
    const getData = async () => {
      try {
        const BRAND_REPO = new BrandApiRepository();
        setIsLoadingBrands(true);
        const brands = await BRAND_REPO.findAll();
        setBrands(brands);
        const COUNTRY_REPO = new CitiesRepository();
        const Regions = await COUNTRY_REPO.findCuntries();
        setAllRegions(Regions);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoadingBrands(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const CITYES_REPO = new CitiesRepository();
      //  --> Mostrar Ciudades para seleccionar ciodades, avanzar por paso, si no tengo que hacer fetch de todos los estados de los paises seleccionados en regiones y obtener sus codigos iso2 y disparar fetch para las ciudades.
    };
    getData();
  }, [codes]);

  const onSubmitHandler = async (data: KeywordResearchDTO) => {
    console.log(data);
  };

  return (
    <form
      className="max-w-7xl  container  flex flex-col gap-4 items-start justify-start"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <header className="relative">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold">
          Keyword Research Tool
        </h1>
        <p className="text-foreground/70 text-pretty">
          Enterprise-grade keyword research powered by advanced AI. Leverage the
          same strategic approach used by industry leaders to discover
          high-impact, filter out irrelevant terms and analyze search patterns
          to identify the most profitable keywords for your business.
        </p>
        <div className="flex items-center gap-2 md:absolute md:top-0 md:right-0 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-medium relative"
          >
            <Video /> See how it works
            <span className="rounded-full size-3  absolute -top-1 -right-1 bg-green-500/50 animate-ping" />
            <span className="rounded-full size-2    absolute -top-0.5 -right-0.5 bg-green-500 " />
          </Button>
        </div>
      </header>

      <CustomCard title="Research Details" icon={Tag}>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
          <div className="grid grid-cols-12 w-full gap-2 ">
            <div className=" col-span-9">
              <CustomControllerInput
                control={control}
                name="title"
                placeholder="Title for your Keyword Research"
                error={errors.title}
              />
            </div>
            <div className="col-span-3">
              <CustomControllerInput
                type="number"
                control={control}
                name="searchVolume"
                placeholder="Volume of Search"
                error={errors.searchVolume}
              />
            </div>
          </div>
          <div className="flex items-start h-14 gap-2">
            <Controller
              control={control}
              name="requestLanguage"
              render={({ field }) => (
                <div>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      value={field.value}
                      className="w-28 bg-primary! text-primary-foreground"
                      size="sm"
                    >
                      <Languages className="text-primary-foreground" />
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="ES">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Sheet>
              <Button asChild size={"sm"}>
                <SheetTrigger>
                  <Globe2 />
                  Region
                </SheetTrigger>
              </Button>
              <SheetContent className="p-4">
                <SheetHeader>
                  <SheetTitle>Select Region</SheetTitle>
                </SheetHeader>
                <SheetDescription>
                  You can find and add Search for regions like countries, states
                  or cities
                </SheetDescription>
                {allRegions && (
                  <RegionSelector
                    region={allRegions}
                    onFinish={(data) => {
                      setValue("region", data.selectedCountries);
                      setCodes(data.selectedCodes);
                    }}
                  />
                )}
              </SheetContent>
            </Sheet>
            <Button onClick={() => setIsDialogOpen(!isDialogOpen)} size={"sm"}>
              <Tags /> Brands{" "}
            </Button>
            <ControlledDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              title="Select Brands For You Research"
            >
              <>
                {isLoadingBrands && (
                  <div>
                    <CustomLoading message="Getting Brands" />
                  </div>
                )}
                {!isLoadingBrands && brands && brands.length > 0 && (
                  <div>
                    <ul>
                      {brands.map((br, i) => (
                        <li key={br.id!}>
                          {i + 1} - {br.name!}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!isLoadingBrands && brands && brands.length === 0 && (
                  <div>
                    <CustomEmpty
                      title="No Brands Found"
                      description="No brands found"
                      icon={Tags}
                      onClick={() => console.log("brands")}
                    />
                  </div>
                )}
              </>
            </ControlledDialog>
            <Button size={"sm"}>
              <Bell />
            </Button>
          </div>
        </div>
      </CustomCard>

      <div className="grid gap-2 lg:grid-cols-2 w-full">
        <CustomCard title="Target Keywords" icon={Target}>
          <div className="flex flex-col gap-6 w-full">
            <CustomKeywordInputComponent
              controlHandler={control}
              emptyMessageWorldsContainer="No Positive Keywords Added"
              inputHandleOnClick={() =>
                handleAdd("positiveKeywords", temporalWord.positive)
              }
              inputOnChangeValue={(e) => handleTemporalWord(e, "positive")}
              inputValue={temporalWord.positive}
              name="positiveKeywords"
              onClearWorldsContainer={() => handleReset("positiveKeywords")}
              onDeleteWorldsContainer={(valueToRemove) =>
                handleDelete("positiveKeywords", valueToRemove)
              }
            />

            <Button
              size="sm"
              className="text-xs font-medium w-full"
              variant={"secondary"}
            >
              <Bot /> Suggest Keyword With AI
            </Button>
          </div>
        </CustomCard>
        <CustomCard title="Negative Keywords" icon={CircleOff}>
          <div className="flex flex-col gap-6 w-full">
            <CustomKeywordInputComponent
              controlHandler={control}
              emptyMessageWorldsContainer="No Negative Keywords Added"
              inputHandleOnClick={() =>
                handleAdd("negativeKeywords", temporalWord.negative)
              }
              inputOnChangeValue={(e) => handleTemporalWord(e, "negative")}
              inputValue={temporalWord.negative}
              name="negativeKeywords"
              onClearWorldsContainer={() => handleReset("negativeKeywords")}
              onDeleteWorldsContainer={(valueToRemove) =>
                handleDelete("negativeKeywords", valueToRemove)
              }
            />
            <Button
              size="sm"
              className="text-xs font-medium w-full"
              variant={"secondary"}
            >
              <Bot /> Suggest Keyword With AI
            </Button>
          </div>
        </CustomCard>
      </div>
      <CustomCard
        title="Cities Filter"
        icon={MapPin}
        disabled={region.length === 0}
      >
        <div className="flex flex-col gap-6 w-full">
          {region.length > 0 && (
            <div className="flex items-center gap-2">
              {region.slice(0, 5).map((reg) => (
                <Badge key={reg}>{reg}</Badge>
              ))}
              {region.length > 5 && `and ${region.length - 5} more`}
            </div>
          )}
          <div className="w-full flex gap-2 items-center">
            <InputGroup>
              <InputGroupInput placeholder="Enter a city name..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center justify-center gap-2 w-full max-w-32 ">
              <Switch />{" "}
              <span className="flex items-center gap-2 text-xs">
                <Globe className="size-2.5 md:block hidden" />
                <span className="text-[0.6rem]">Use All Cities</span>
              </span>
            </div>
            <Button size="sm" className="text-xs font-medium">
              Submit
            </Button>
          </div>
          <WordsContainer
            message="No Cities Added"
            list={[]}
            onDelete={() => console.log("Delete")}
            onClear={() => console.log("Clear")}
          />
        </div>
      </CustomCard>
      <CustomCard title="Extra Positive Keywords" icon={Target}>
        <div className="flex flex-col gap-6 w-full">
          <CustomKeywordInputComponent
            controlHandler={control}
            emptyMessageWorldsContainer="No Extra Positive Words Keywords Added"
            inputHandleOnClick={() =>
              handleAdd("extraPositiveKeywords", temporalWord.negative)
            }
            inputOnChangeValue={(e) => handleTemporalWord(e, "extraPositive")}
            inputValue={temporalWord.extraPositive}
            name="extraPositiveKeywords"
            onClearWorldsContainer={() => handleReset("extraPositiveKeywords")}
            onDeleteWorldsContainer={(valueToRemove) =>
              handleDelete("extraPositiveKeywords", valueToRemove)
            }
          />
        </div>
      </CustomCard>
      <CustomCard title="Search Intent" icon={Focus} variant="banner">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                return (
                  <RadioGroup {...field} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="TRANSACTIONAL"
                        id="transactional"
                      />
                      <Label htmlFor="transactional">Transactional</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="INFORMATIONAL"
                        id="informational"
                      />
                      <Label htmlFor="informational">Informational</Label>
                    </div>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className="w-full flex items-center justify-center"></div>
        </div>
      </CustomCard>
      <Button
        size={"sm"}
        variant={"secondary"}
        className="max-w-64 p-4"
        type="submit"
      >
        <Send />
        Run Keyword Research
      </Button>
    </form>
  );
};
