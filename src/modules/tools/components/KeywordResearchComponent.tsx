"use client";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
  Switch,
} from "@/components/ui";
import {
  Bell,
  Bot,
  CircleOff,
  Focus,
  Globe,
  Languages,
  MapPin,
  Plus,
  Search,
  Send,
  Tag,
  Tags,
  Target,
  Video,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
import { CustomCard } from "@/components/CustomCard";

export const KeywordResearchComponent = () => {
  return (
    <div className="max-w-7xl mx-auto container  flex flex-col gap-4 items-start justify-start">
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
        <div className="w-full grid xl:grid-cols-4 gap-2 ">
          <div className="xl:col-span-2">
            <Input placeholder="Enter a title for your keyword research" />
          </div>
          <div className="xl:col-span-2 flex md:flex-row flex-col items-center justify-start gap-2">
            <div className="w-full">
              <Input placeholder="Search volume"></Input>
            </div>
            <div className="w-full flex items-center justify-center gap-2">
              <Button size={"sm"} className="text-xs font-medium">
                <Languages />
                Language
              </Button>
              <Button size={"sm"} className="text-xs font-medium">
                <Globe /> Region
              </Button>
              <Button size={"sm"} className="text-xs font-medium">
                <Tags /> Tags
              </Button>
              <Button size={"sm"} className="text-xs font-medium">
                <Bell />
              </Button>
            </div>
          </div>
        </div>
      </CustomCard>
      <div className="grid gap-2 lg:grid-cols-2 w-full">
        <CustomCard title="Target Keywords" icon={Target}>
          <div className="flex flex-col gap-6 w-full">
            <InputGroup>
              <InputGroupInput placeholder="Enter a keyword" />
              <InputGroupButton className="p-0">
                <Button size="sm" className="text-xs font-medium">
                  <Plus />
                </Button>
              </InputGroupButton>
            </InputGroup>
            <div className="w-full min-h-96 border rounded-lg bg-accent/20 flex flex-col items-center justify-start p-4">
              <p className="text-foreground/50">No Keywords Added</p>
            </div>
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
            <InputGroup>
              <InputGroupInput placeholder="Enter a keyword" />
              <InputGroupButton className="p-0">
                <Button size="sm" className="text-xs font-medium">
                  <Plus />
                </Button>
              </InputGroupButton>
            </InputGroup>
            <div className="w-full min-h-96 border rounded-lg bg-accent/20 flex flex-col items-center justify-start p-4">
              <p className="text-foreground/50">No Keywords Added</p>
            </div>
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
      <CustomCard title="Cities Filter" icon={MapPin}>
        <div className="flex flex-col gap-6 w-full">
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
          <div className="w-full min-h-96 border rounded-lg bg-accent/20 flex flex-col items-center justify-start p-4">
            <p className="text-foreground/50">No Cities Added</p>
          </div>
        </div>
      </CustomCard>
      <CustomCard title="Extra Positive Keywords" icon={Target}>
        <div className="flex flex-col gap-6 w-full">
          <InputGroup>
            <InputGroupInput placeholder="Enter extra keywords" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupButton className="p-0">
              <Button size="sm" className="text-xs font-medium">
                <Plus />
              </Button>
            </InputGroupButton>
          </InputGroup>
          <div className="w-full min-h-96 border rounded-lg bg-accent/20 flex flex-col items-center justify-start p-4">
            <p className="text-foreground/50">No Extra Keywords Added</p>
          </div>
        </div>
      </CustomCard>
      <CustomCard title="Search Intent" icon={Focus} variant="banner">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="default" id="transactional" />
                <Label htmlFor="transactional">Transactional</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="comfortable" id="informational" />
                <Label htmlFor="informational">Informational</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="w-full flex items-center justify-center">
            <Button size={"sm"} variant={"secondary"} className="max-w-64 p-4">
              <Send />
              Run Keyword Research
            </Button>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};
