"use client";
import { GenericDataTable } from "@/components/GenericDataTable";
import { KeywordResearchEntity } from "@/core/entities";
import {
  Badge,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useResearchStore } from "../../all-request/context/ResearchStore";
import { useState } from "react";
import { ControlledDialog } from "@/components/ControlledDialog";
import KeywordDataTable from "../../../../../../Components_To_Review/KeywordDataTable";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: KeywordResearchEntity[];
  onEdit?: (brand: KeywordResearchEntity) => void;
  onDelete?: (brand: KeywordResearchEntity) => void;
  onAdd?: () => void;
  //   companies: CompanyEntity[];
}

export function KeywordResearchDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  const setSelectedResearch = useResearchStore((st) => st.setSelectedResearch);
  const selectedResearch = useResearchStore((st) => st.selectedResearch);
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  function formatearNumeroTabla(num, decimales = 1) {
    if (isNaN(num)) {
      return "N/A";
    }

    const absNum = Math.abs(num);

    if (absNum < 10000) {
      return num.toLocaleString("es-ES", { maximumFractionDigits: 0 });
    }

    const sufixes = [
      { value: 1e3, symbol: "K" }, // Kilo
      { value: 1e6, symbol: "M" }, // Mega
      { value: 1e9, symbol: "B" }, // Billón (Giga)
      { value: 1e12, symbol: "T" }, // Trillón (Tera)
    ];

    const sufix = sufixes.reverse().find((s) => absNum >= s.value);

    if (sufix) {
      const formatedNum = (num / sufix.value).toFixed(decimales);

      return formatedNum.replace(".", ",") + sufix.symbol;
    }

    return num.toPrecision(3);
  }

  const renderType = (value: string) => {
    return (
      <Badge
        className={cn(
          "text-xs",
          value === "INFORMATIONAL"
            ? "bg-orange-500/10 dark:text-orange-500 text-orange-700"
            : "bg-purple-500/10 dark:text-purple-500 text-purple-700"
        )}
      >
        {value}
      </Badge>
    );
  };

  const renderStatus = (value: string) => {
    return (
      <Badge
        className={cn(
          "text-xs",
          value === "CREATED" &&
            "bg-green-500/10 dark:text-green-500 text-green-700",
          value === "IN_PROGRESS" &&
            "bg-blue-500/10 text-blue-700 dark:text-blue-500"
        )}
      >
        {value.replace("_", " ")}
      </Badge>
    );
  };

  type WordsValue = string[] | Record<string | number, unknown>;

  const renderWords = (
    value: WordsValue,
    type: "Words" | "Brands" | "Cities" = "Words"
  ) => {
    let words: string[] = [];

    if (Array.isArray(value)) {
      words = value;
    } else if (typeof value === "object" && value !== null) {
      const firstValue = Object.values(value)[0];

      if (Array.isArray(firstValue)) {
        words = firstValue;
      }
    }

    if (!words.length)
      return <span className="italic opacity-50 ">No {type} Provided</span>;

    return (
      <div className="flex flex-wrap gap-2">
        {words.slice(0, 4).map((word, index) => (
          <Badge key={index} variant="secondary">
            {index >= 4 ? `... ${words.length - index} more` : word}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <>
      <GenericDataTable<KeywordResearchEntity>
        data={data}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd ? () => onAdd() : undefined}
        showAddButton={!!onAdd}
        customRenderers={{
          searchVolume: (value) => formatearNumeroTabla(value),
          type: (value) => renderType(value),
          status: (value) => renderStatus(value),
          positiveKeywords: (value) => renderWords(value),
          extraPositiveKeywords: (value) => renderWords(value),
          negativeKeywords: (value) => renderWords(value),
          brand: (value) => renderWords(value, "Brands"),
          city: (value) => renderWords(value, "Cities"),
        }}
        onShow={(item) => {
          setSelectedResearch(item);
          if (selectedResearch.result) {
            setIsOpen(false);
            setShowTable(true);
          } else {
            setShowTable(false);
            setIsOpen(!isOpen);
          }
        }}
        excludeColumns={[
          "generatedPositiveKeywords",
          "generatedNegativeKeywords",
          "allCitys",
          "companyId",
          "tag",
          "generatedPositiveKeyWordFullInfo",
          "requesterId",
          "result",
          "tasks",
          "organicResult",
          "organicResultFull",
        ]}
      />
      {selectedResearch && (
        <ControlledDialog
          title={`SEO Keyword Analysis - ${selectedResearch.title!}`}
          open={isOpen}
          onOpenChange={setIsOpen}
          description={`${selectedResearch.type} • ${
            selectedResearch.region
          } • ${selectedResearch.requestLanguage.toUpperCase()}`}
        >
          <>
            {!selectedResearch.result && (
              <Empty>
                <EmptyMedia variant="icon">
                  <AlertTriangle />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle> No Results</EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </>
        </ControlledDialog>
      )}

      {selectedResearch && showTable && (
        <div>
          {" "}
          <KeywordDataTable keywordData={selectedResearch} />{" "}
        </div>
      )}
    </>
  );
}
