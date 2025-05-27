"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  Controller
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Square, SquareHeader } from "../patients/[id]/Square";
import { ChevronLeftIcon, UploadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import psiImage from "/public/img/avatar.svg";
import { PencilAltIcon } from "@heroicons/react/outline";
import { Phone } from "../../../models/vos/Phone";
import InputMask from "react-input-mask-next";
import { getProfileData, setProfile } from "@/services/profileService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateProfilePicture } from "./uploadImage";
import Loading from "@/components/loading/Loading";

const fileListType =
  typeof window !== "undefined" && typeof FileList !== "undefined"
    ? z.instanceof(FileList)
    : z.any();

const profileSchema = z.object({
  picture: fileListType.optional(),
  person: z.object({
    _name: z.string().min(1, "Nome é obrigatório"),
    _birthdate: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine((val) => moment.utc(val, "YYYY-MM-DD", true).isValid(), {
        message: "Data de nascimento inválida"
      }),
    _id: z.string().min(1),
    _cpf: z.string().min(1, "CPF é obrigatório"),
    _rg: z.string().min(1, "RG é obrigatório"),
    _phone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
    _profilePicture: z.string(),
    address: z.object({
      zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
      street: z.string().min(1, "Rua é obrigatória"),
      homeNumber: z.string().min(1, "Número é obrigatório"),
      complement: z.string(),
      district: z.string().min(1, "Bairro é obrigatório"),
      city: z.string().min(1, "Cidade é obrigatória"),
      state: z.string().min(1, "Estado é obrigatório")
    })
  }),
  crp: z.string().min(1, "CRP é obrigatório")
});

type ProfileData = z.infer<typeof profileSchema>;

function formatPhone(phoneObj: Phone): string {
  const ddd = phoneObj._ddd.replace("+", "");
  const number = phoneObj._number.trim();
  if (number.length === 9) {
    return `(${ddd})${number.slice(0, 5)}-${number.slice(5)}`;
  } else {
    return `(${ddd}) ${number}`;
  }
}

function formatCEP(cep: string): string {
  const cepNumbers = cep.replace(/\D/g, "").padStart(8, "0");
  return `${cepNumbers.slice(0, 5)}-${cepNumbers.slice(5)}`;
}

function cleanPhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

export default function Profile() {
  const [defaultProfileData, setDefaultProfileData] = useState<ProfileData>({
    person: {
      _name: "",
      _birthdate: "",
      _cpf: "",
      _rg: "",
      _phone: "",
      _id: "",
      _profilePicture: "",
      address: {
        zipCode: "",
        street: "",
        homeNumber: "",
        complement: "",
        district: "",
        city: "",
        state: ""
      }
    },
    crp: ""
  });
  const methods = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfileData,
    mode: "onChange"
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { register, handleSubmit, formState, control, watch } = methods;
  const { errors } = formState;
  const [image, setImage] = useState<string | null>(null);
  const selectedImage = watch("picture");

  useEffect(() => {
    async function getProfile() {
      const value = await getProfileData();

      const formattedData: ProfileData = {
        person: {
          _name: value.user.person._name || "",
          _birthdate:
            moment
              .utc(value.user.person._birthdate)
              .format("YYYY-MM-DD") || "",
          _cpf: value.user.person._cpf._cpf || "",
          _rg: value.user.person._rg || "",
          _id: value.user.person._id._id || "",
          _phone: formatPhone(value.user.person._phone) || "",
          _profilePicture: value.user.person._profilePicture || "",
          address: {
            zipCode:
              formatCEP(value.user.person.address._zipCode) || "",
            street: value.user.person.address._street || "",
            homeNumber: value.user.person.address._homeNumber || "",
            complement: value.user.person.address._complement || "",
            district: value.user.person.address._district || "",
            city: value.user.person.address._city || "",
            state: value.user.person.address._state || ""
          }
        },
        crp: value._crp._crp || ""
      };

      setDefaultProfileData(formattedData);
      methods.reset(formattedData);
      setIsFirstLoad(false);
    }

    getProfile();
  }, [methods]);

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

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    setLoading(true);
    const { person } = data;
    const phoneParts = person._phone.split(/[\(\)]/);
    person._phone = cleanPhone(person._phone);
    const phoneData = {
      ddi: "+55",
      ddd: phoneParts[1],
      number: phoneParts[2]
    };
    const { _cpf, _rg, _phone, _profilePicture, _id, ...personData } =
      person;

    if (selectedImage && selectedImage.length > 0) {
      try {
        const profileUpdateResponse = await updateProfilePicture(
          _id,
          selectedImage
        );
        if (profileUpdateResponse?.newImageUrl) {
          setImage(profileUpdateResponse.newImageUrl);
          person._profilePicture = profileUpdateResponse.newImageUrl;
          toast.success("Imagem atualizada com sucesso");
        }
      } catch (error) {
        setLoading(false);
        toast.error("Erro ao atualizar a imagem.");
        return;
      }
    }
    const sendData = {
      person: { ...personData, phone: phoneData }
    };
    const response = await setProfile(sendData);
    setLoading(false);

    if (response?.error) {
      toast.error("Algo de errado aconteceu.");
    } else {
      toast.success("Dados atualizados com sucesso");
      data.person._profilePicture = response.user.person._profilePicture;
      setDefaultProfileData(data);
      setIsEditing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <main className="flex flex-col items-center justify-center bg-cover px-10 py-5">
        {isFirstLoad ? <Loading /> : <>
          <div className="mb-2 flex w-full">
            <Link href={"/patients"} className="flex">
              <ChevronLeftIcon
                width={24}
                height={24}
                className="text-gray-500"
              />
              &nbsp;
              <span className="text-gray-900">
                {defaultProfileData.person._name}
              </span>
            </Link>
          </div>

          <div className="w-[60vw]">
            {!isEditing && (
              <div
                className="flex cursor-pointer items-center justify-end space-x-3"
                onClick={() => {
                  setImage(null);
                  setIsEditing(!isEditing);
                }}
              >
                <span className="text-primary-600">
                  Editar perfil
                </span>
                <PencilAltIcon
                  className="text-primary-400"
                  width={24}
                  height={24}
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Card do Perfil */}
                <Square variant="WithImage">
                  {!isEditing ? (
                    <Image
                      className="mb-4 h-24 w-24 rounded-full"
                      src={
                        defaultProfileData.person
                          ._profilePicture || psiImage
                      }
                      alt="Profile"
                      width={100}
                      height={100}
                      unoptimized
                    />
                  ) : (
                    <div className="mb-3 flex w-full flex-col items-center justify-center">
                      <input
                        type="file"
                        id="foto-paciente"
                        accept="image/jpeg, image/png"
                        {...register("picture")}
                        className="hidden"
                      />
                      <label
                        htmlFor="foto-paciente"
                        className="cursor-pointer"
                      >
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
                            <UploadIcon
                              width={75}
                              height={75}
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("person._name")}
                        className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                      />
                      <Link
                        className="mt-4 text-primary-500"
                        href="/profile/change-password/"
                      >
                        Atualizar senha
                      </Link>
                    </>
                  ) : (
                    <h2 className="text-xl text-gray-900">
                      {methods.getValues("person._name")}
                    </h2>
                  )}
                  {errors.person?._name && (
                    <p className="text-sm text-red-500">
                      {errors.person._name.message}
                    </p>
                  )}
                </Square>

                {/* Informações do Paciente */}
                <Square>
                  <SquareHeader titulo="Informações pessoais" />
                  {isEditing ? (
                    <>
                      <div className="mb-2">
                        <label className="block text-gray-700">
                          Nascimento:
                        </label>
                        <input
                          type="date"
                          {...register(
                            "person._birthdate"
                          )}
                          defaultValue={methods.getValues(
                            "person._birthdate"
                          )}
                          className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                        />
                        {errors.person?._birthdate && (
                          <p className="text-sm text-red-500">
                            {
                              errors.person._birthdate
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="mb-2">
                        <label className="block text-gray-700">
                          CPF:
                        </label>
                        <input
                          type="text"
                          disabled={true}
                          {...register("person._cpf")}
                          className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
                        />
                        {errors.person?._cpf && (
                          <p className="text-sm text-red-500">
                            {errors.person._cpf.message}
                          </p>
                        )}
                        <label className="block text-gray-700">
                          RG:
                        </label>
                        <input
                          type="text"
                          disabled={true}
                          {...register("person._rg")}
                          className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
                        />
                        {errors.person?._rg && (
                          <p className="text-sm text-red-500">
                            {errors.person._rg.message}
                          </p>
                        )}

                        <label className="block text-gray-700">
                          Tel:
                        </label>
                        <InputMask
                          mask={"(99) 99999-9999"}
                          type="text"
                          {...register("person._phone")}
                          className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                        />

                        {errors.person?._phone && (
                          <p className="text-sm text-red-500">
                            {
                              errors.person._phone
                                .message
                            }
                          </p>
                        )}
                        <label className="block text-gray-700">
                          CRP:
                        </label>
                        <input
                          type="text"
                          disabled={true}
                          {...register("crp")}
                          className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
                        />
                        {errors.crp && (
                          <p className="text-sm text-red-500">
                            {errors.crp.message}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        Nascimento:{" "}
                        {moment
                          .utc(
                            methods.getValues(
                              "person._birthdate"
                            ),
                            "YYYY-MM-DD"
                          )
                          .format("DD/MM/YYYY")}
                      </p>

                      <p>
                        CPF:{" "}
                        {methods.getValues("person._cpf")}
                      </p>
                      <p>
                        RG:{" "}
                        {methods.getValues("person._rg")}
                      </p>
                      <p>
                        Tel:{" "}
                        {methods.getValues("person._phone")}
                      </p>
                      <p>CRP: {methods.getValues("crp")}</p>
                    </>
                  )}
                </Square>

                {/* Endereço */}
                <Square variant="DoubleColumn">
                  <SquareHeader titulo="Endereço" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex-col space-y-3">
                      {isEditing ? (
                        <>
                          <div>
                            <label className="block text-gray-700">
                              CEP:
                            </label>
                            <InputMask
                              type="text"
                              mask={"99999-999"}
                              {...register(
                                "person.address.zipCode"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.zipCode && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .zipCode
                                      .message
                                  }
                                </p>
                              )}
                            <label className="block text-gray-700">
                              Rua:
                            </label>
                            <input
                              type="text"
                              {...register(
                                "person.address.street"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.street && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .street
                                      .message
                                  }
                                </p>
                              )}
                            <label className="block text-gray-700">
                              Número:
                            </label>
                            <input
                              type="text"
                              {...register(
                                "person.address.homeNumber"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.homeNumber && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .homeNumber
                                      .message
                                  }
                                </p>
                              )}
                            <label className="block text-gray-700">
                              Complemento:
                            </label>
                            <input
                              type="string"
                              {...register(
                                "person.address.complement"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.complement && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .complement
                                      .message
                                  }
                                </p>
                              )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            CEP:{" "}
                            {methods.getValues(
                              "person.address.zipCode"
                            )}
                          </p>
                          <p>
                            Rua:{" "}
                            {methods.getValues(
                              "person.address.street"
                            )}
                          </p>
                          <p>
                            Número:{" "}
                            {methods.getValues(
                              "person.address.homeNumber"
                            )}
                          </p>
                          {defaultProfileData.person.address.complement &&
                            <p>
                              Complemento:{" "}
                              {methods.getValues(
                                "person.address.complement"
                              )}
                            </p>
                          }

                        </>
                      )}
                    </div>
                    <div className="flex-col space-y-3">
                      {isEditing ? (
                        <>
                          <div>
                            <label className="block text-gray-700">
                              Bairro:
                            </label>
                            <input
                              type="text"
                              {...register(
                                "person.address.district"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.district && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .district
                                      .message
                                  }
                                </p>
                              )}
                            <label className="block text-gray-700">
                              Cidade:
                            </label>
                            <input
                              type="text"
                              {...register(
                                "person.address.city"
                              )}
                              className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
                            />
                            {errors.person?.address
                              ?.city && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .city
                                      .message
                                  }
                                </p>
                              )}
                            <label className="block text-gray-700">
                              Estado:
                            </label>
                            <Controller
                              name="person.address.state"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={
                                    field.onChange
                                  }
                                  value={
                                    field.value
                                  }
                                >
                                  <SelectTrigger
                                    className={
                                      errors
                                        .person
                                        ?.address
                                        ?.state
                                        ? "w-full border-red-500 focus:ring-red-600"
                                        : "w-full border-primary-400 focus:ring-primary-500"
                                    }
                                  >
                                    <SelectValue placeholder="Selecione o estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AC">
                                      Acre
                                    </SelectItem>
                                    <SelectItem value="AL">
                                      Alagoas
                                    </SelectItem>
                                    <SelectItem value="AP">
                                      Amapá
                                    </SelectItem>
                                    <SelectItem value="AM">
                                      Amazonas
                                    </SelectItem>
                                    <SelectItem value="BA">
                                      Bahia
                                    </SelectItem>
                                    <SelectItem value="CE">
                                      Ceará
                                    </SelectItem>
                                    <SelectItem value="DF">
                                      Distrito
                                      Federal
                                    </SelectItem>
                                    <SelectItem value="ES">
                                      Espírito
                                      Santo
                                    </SelectItem>
                                    <SelectItem value="GO">
                                      Goiás
                                    </SelectItem>
                                    <SelectItem value="MA">
                                      Maranhão
                                    </SelectItem>
                                    <SelectItem value="MT">
                                      Mato
                                      Grosso
                                    </SelectItem>
                                    <SelectItem value="MS">
                                      Mato
                                      Grosso
                                      do Sul
                                    </SelectItem>
                                    <SelectItem value="MG">
                                      Minas
                                      Gerais
                                    </SelectItem>
                                    <SelectItem value="PA">
                                      Pará
                                    </SelectItem>
                                    <SelectItem value="PB">
                                      Paraíba
                                    </SelectItem>
                                    <SelectItem value="PR">
                                      Paraná
                                    </SelectItem>
                                    <SelectItem value="PE">
                                      Pernambuco
                                    </SelectItem>
                                    <SelectItem value="PI">
                                      Piauí
                                    </SelectItem>
                                    <SelectItem value="RJ">
                                      Rio de
                                      Janeiro
                                    </SelectItem>
                                    <SelectItem value="RN">
                                      Rio
                                      Grande
                                      do Norte
                                    </SelectItem>
                                    <SelectItem value="RS">
                                      Rio
                                      Grande
                                      do Sul
                                    </SelectItem>
                                    <SelectItem value="RO">
                                      Rondônia
                                    </SelectItem>
                                    <SelectItem value="RR">
                                      Roraima
                                    </SelectItem>
                                    <SelectItem value="SC">
                                      Santa
                                      Catarina
                                    </SelectItem>
                                    <SelectItem value="SP">
                                      São
                                      Paulo
                                    </SelectItem>
                                    <SelectItem value="SE">
                                      Sergipe
                                    </SelectItem>
                                    <SelectItem value="TO">
                                      Tocantins
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.person?.address
                              ?.state && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.person
                                      .address
                                      .state
                                      .message
                                  }
                                </p>
                              )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            Bairro:{" "}
                            {methods.getValues(
                              "person.address.district"
                            )}
                          </p>
                          <p>
                            Cidade:{" "}
                            {methods.getValues(
                              "person.address.city"
                            )}
                          </p>
                          <p>
                            Estado:{" "}
                            {methods.getValues(
                              "person.address.state"
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Square>
              </div>
              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      methods.reset(defaultProfileData);
                    }}
                    disabled={loading}
                    className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 rounded bg-primary-600 px-4 py-2 text-white"
                  >
                    {!loading ? "Salvar" : "Carregando..."}
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
        }
      </main>
    </FormProvider>
  );
}
