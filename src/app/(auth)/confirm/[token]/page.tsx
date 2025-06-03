"use client"
import Image from "next/image";
import confirmImage from '../confirm_email.svg';
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { confirmEmail } from "@/services/confirmEmailService";
import { toast } from "sonner";

export default function ConfirmPage({ params }: { params: { token: string } }) {
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const router = useRouter();
  const token = params.token;
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    
    async function getConfirm() {
      if (!token) {
        router.push('/login');
        return;
      }

      const success = await confirmEmail(token);
      if (success) {
        setIsConfirmed(true);
      } else {
        setIsConfirmed(false);
      }
    }

    getConfirm();
  }, [router, token]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-cover p-5 md:p-10">
      {isConfirmed === null ? (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-[30px] border border-primary-500 bg-gradiente-vidro p-9 md:w-4/5">
          <h2 className="text-3xl text-primary-950">Confirmando e-mail...</h2>
          <p className="mb-4 mt-8 text-xl text-primary-950">
            Aguarde um momento, estamos confirmando seu e-mail...
          </p>
        </div>
      ) : (
        <section className="flex h-full w-full flex-row items-center justify-around rounded-[30px] border border-primary-500 bg-gradiente-vidro p-9 md:w-4/5">
          <section className="w-full md:w-2/5 text-primary-950">
            {
              isConfirmed ?
                (
                  <>
                    <h2 className="text-3xl">E-mail confirmado</h2>
                    <p className="mb-4 mt-8 text-xl">
                      E-mail confirmado com sucesso, agora você pode fazer login.
                    </p>
                  </>
                )
                :
                (
                  <>
                    <h2 className="text-3xl">Erro ao confirmar e-mail</h2>
                    <p className="mb-4 mt-8 text-xl">
                      Problemas ao confirmar seu email. Verifique e entre em contato com a equipe de suporte.
                    </p>
                  </>
                )
            }

          </section>
          {isConfirmed === true &&
            <section className="hidden lg:w-2/5 lg:block">
              <Image src={confirmImage} alt="Moça recebendo carta de um passarinho" />
            </section>
          }

        </section>
      )}
    </main>
  );
}
