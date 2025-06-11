export class CreateLeadDto {
  name: string;
  company?: string;
  document?: string;  // CPF ou CNPJ
  email?: string;
  phone?: string;
  origin?: string;
  market?: string;
}
