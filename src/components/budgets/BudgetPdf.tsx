
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

type BudgetItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  position: number;
};

export type BudgetPdfData = {
  number: string;
  companyName: string;
  companyCnpj: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  clientName: string;
  projectTitle: string;
  activitiesDescription: string | null;
  observations: string | null;
  paymentConditions: string | null;
  total: number;
  createdAt: string;
  items: BudgetItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 48,
    paddingHorizontal: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#222222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 12,
    marginBottom: 18,
  },
  companyName: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  budgetInfo: {
    textAlign: "right",
    fontSize: 9,
    lineHeight: 1.5,
  },
  budgetNumber: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  client: {
    fontSize: 10,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 7,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 15,
  },
  table: {
    marginTop: 4,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#777777",
    paddingVertical: 7,
    paddingHorizontal: 5,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbbbbb",
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  description: {
    width: "48%",
    paddingRight: 5,
  },
  quantity: {
    width: "12%",
    textAlign: "right",
  },
  unitPrice: {
    width: "20%",
    textAlign: "right",
  },
  subtotal: {
    width: "20%",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1.5,
    borderColor: "#333333",
    paddingTop: 8,
    marginTop: 2,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 18,
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  section: {
    marginBottom: 15,
  },
  signatureArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 42,
  },
  signature: {
    width: "43%",
    borderTopWidth: 0.8,
    borderTopColor: "#555555",
    paddingTop: 7,
    textAlign: "center",
    fontSize: 9,
  },
  date: {
    marginTop: 25,
    textAlign: "right",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 42,
    right: 42,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
  },
});

function BudgetDocument({ budget }: { budget: BudgetPdfData }) {
  const sortedItems = [...budget.items].sort(
    (a, b) => a.position - b.position
  );

  return (
    <Document
      title={`${budget.number} - ${budget.projectTitle}`}
      author={budget.companyName}
      subject="Orçamento"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={{ width: "65%" }}>
            <Text style={styles.companyName}>{budget.companyName}</Text>
            {budget.companyCnpj && (
              <Text style={styles.companyInfo}>
                CNPJ: {budget.companyCnpj}
              </Text>
            )}
            {budget.companyAddress && (
              <Text style={styles.companyInfo}>
                {budget.companyAddress}
              </Text>
            )}
            {budget.companyPhone && (
              <Text style={styles.companyInfo}>
                Tel.: {budget.companyPhone}
              </Text>
            )}
            {budget.companyEmail && (
              <Text style={styles.companyInfo}>
                {budget.companyEmail}
              </Text>
            )}
          </View>

          <View style={{ width: "35%" }}>
            <Text style={styles.budgetInfo}>ORÇAMENTO</Text>
            <Text style={styles.budgetNumber}>{budget.number}</Text>
            <Text style={styles.budgetInfo}>
              {formatDate(budget.createdAt)}
            </Text>
          </View>
        </View>

        <Text style={styles.projectTitle}>{budget.projectTitle}</Text>
        <Text style={styles.client}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>CLIENTE: </Text>
          {budget.clientName}
        </Text>

        {budget.activitiesDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Descrição das atividades
            </Text>
            <Text style={styles.paragraph}>
              {budget.activitiesDescription}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preços</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.description}>Item</Text>
              <Text style={styles.quantity}>Qtd.</Text>
              <Text style={styles.unitPrice}>Valor unitário</Text>
              <Text style={styles.subtotal}>Subtotal</Text>
            </View>

            {sortedItems.map((item) => (
              <View key={item.id} style={styles.tableRow} wrap={false}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Text style={styles.unitPrice}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.subtotal}>
                  {formatCurrency(item.subtotal)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow} wrap={false}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(budget.total)}
              </Text>
            </View>
          </View>
        </View>

        {budget.observations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.paragraph}>{budget.observations}</Text>
          </View>
        )}

        {budget.paymentConditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Condições de pagamento
            </Text>
            <Text style={styles.paragraph}>
              {budget.paymentConditions}
            </Text>
          </View>
        )}

        <View style={styles.signatureArea} wrap={false}>
          <View style={styles.signature}>
            <Text>{budget.clientName}</Text>
            <Text>Cliente</Text>
          </View>

          <View style={styles.signature}>
            <Text>{budget.companyName}</Text>
            <Text>Responsável pelo orçamento</Text>
          </View>
        </View>

        <Text style={styles.date}>{formatDate(budget.createdAt)}</Text>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Orçamento ${budget.number} • Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export function BudgetPdfDownload({
  budget,
}: {
  budget: BudgetPdfData;
}) {
  const filename = `${budget.number.replaceAll("/", "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetDocument budget={budget} />}
      fileName={filename}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 8,
        backgroundColor: "#171717",
        color: "#ffffff",
        padding: "10px 16px",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      {({ loading }) => (loading ? "Gerando PDF..." : "Baixar PDF")}
    </PDFDownloadLink>
  );
}
