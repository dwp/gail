export const q1Response = `### Transferring a Support for Mortgage Interest Loan
#### Porting a Support for Mortgage Interest (SMI) Loan
- Yes, a claimant can transfer their Support for Mortgage Interest (SMI) loan to a new property. This process is known as "porting."
- Porting allows claimants to move to a new property without having to repay their existing SMI loan.
- The outstanding balance of the SMI loan will be transferred to the new property.

#### Impact on Universal Credit
- When a claimant sells their current property, any proceeds from the sale may increase their capital. This could affect their entitlement to Universal Credit.
- In some cases, capital disregards may apply. Claimants should refer to the relevant guidance on capital disregards for more information.

#### Actions for Claimants
- Claimants should be directed to the [Support for Mortgage Interest (SMI) page on GOV.UK](https://www.gov.uk/support-for-mortgage-interest/repaying-your-loan) for more detailed information and support.
- Claimants must report their new address to the Department for Work and Pensions (DWP) once they have moved into the new property.

### Glossary
- Support for Mortgage Interest (SMI): A loan provided to help Universal Credit claimants with interest payments on their mortgage or loans for certain home repairs and improvements.
- Porting: The process of transferring an SMI loan from one property to another.
- Capital Disregards: Rules that allow certain types of capital to be disregarded when calculating entitlement to benefits.`;

export function returnPrototypeResponse(counter: number) {
  const q1 = {
    answer: q1Response,
    citations: [
      {
        title: "Mortgages: Guidance",
        url: "https://intranet.dwp.gov.uk/policy/mortgages-guidance",
        chunks: "",
      },
      {
        title: "The differences between Universal Credit and legacy benefits",
        url: "https://intranet.dwp.gov.uk/policy/differences-between-universal-credit-and-legacy-benefits",
        chunks: "",
      },
    ],
    default_response: false,
    id: 2,
  };

  const responses = [q1];
  const response = responses[counter - 1];

  return response;
}
