import { UploadIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function PatientPictureSection() {
	const [image, setImage] = useState<string | null>(null);
	const { register, watch } = useFormContext();

	const selectedImage = watch("profilePicture");

	useEffect(() => {
		if (selectedImage && selectedImage.length > 0) {
			const file = selectedImage[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}, [selectedImage]);

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<input
				type="file"
				id="foto-paciente"
				accept="image/jpeg, image/png"
				{...register("profilePicture")}
				className="hidden"
			/>
			<label htmlFor="foto-paciente" className="cursor-pointer">
				{image ? (
					<>
						<Image
							src={image}
							alt="Foto Do Paciente"
							className="h-36 w-36 rounded-full object-cover"
							width={140}
							height={140}
						/>
					</>
				) : (
					<div className="flex h-36 w-36 items-center justify-center rounded-full bg-gray-300 p-5">
						<UploadIcon width={75} height={75} />
					</div>
				)}
			</label>
		</div>
	);
}
