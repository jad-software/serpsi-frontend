import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import React from "react";

interface ExtraInfoProps {
	progress: number;
	componentIndex: number;
}

type ExtraInfoForm = {
	comorbidities?: string | undefined;
	previousDocuments?: any;
};

export default function ExtraInfoSection({
	progress,
	componentIndex
}: ExtraInfoProps) {
	// const [medicineNumber, setMedicineNumber] = useState<number>(1);

	const {
		control,
		register,
		watch,
		formState: { errors }
	} = useFormContext<ExtraInfoForm>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "medicines"
	});

	const addMedicine = () => {
		append({
			name: "",
			dosage: 0,
			dosageUnity: "",
			frequency: 0,
			firstTimeOfTheDay: "",
			startDate: undefined,
			observation: ""
		});
	};

	const removeMedicine = () => {
		remove(fields.length - 1);
	};

	const removeAllMedicine = () => {
		remove();
	};

	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Informações Adicionais"
		>
			<>
				<div>
				<InputText
						id="acompanhamentos"
						label="Diploma:"
						placeholder=""
						type="uniqueFile"
						name="previousDocuments"
						accept="application/pdf"
						register={register}
						error={
							errors.previousDocuments
								? errors.previousDocuments.message?.toString()
								: undefined
						}
					/>
				</div>
				<div>
					<InputText
						id="acompanhamentos"
						label="Identidade:"
						placeholder=""
						type="uniqueFile"
						name="previousDocuments"
						accept="application/pdf"
						register={register}
						error={
							errors.previousDocuments
								? errors.previousDocuments.message?.toString()
								: undefined
						}
					/>
				</div>
				<div>
				<InputText
						id="acompanhamentos"
						label="CRP:"
						placeholder=""
						type="uniqueFile"
						name="previousDocuments"
						accept="application/pdf"
						register={register}
						error={
							errors.previousDocuments
								? errors.previousDocuments.message?.toString()
								: undefined
						}
					/>
				</div>
				<br />

				<div className="flex w-full items-center justify-start">
				</div>
				<br />
			</>
		</FormSection>
	);
}
