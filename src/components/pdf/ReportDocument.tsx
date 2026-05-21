import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer'

type Props = {
    customerName: string
    city: string
    state: string

    averageConsumption: number
    systemPower: number
    panels: number
    roofArea: number
    monthlySavings: number
    estimatedGeneration: number
}

const styles = StyleSheet.create({

    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica'
    },

    header: {
        marginBottom: 30
    },

    title: {
        fontSize: 28,
        marginBottom: 8,
        fontWeight: 'bold'
    },

    subtitle: {
        fontSize: 14,
        color: '#666'
    },

    section: {
        marginBottom: 24
    },

    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: 'bold'
    },

    cardGrid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },

    card: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        border: '1 solid #DDD'
    },

    cardTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8
    },

    cardValue: {
        fontSize: 22,
        fontWeight: 'bold'
    },

    footer: {
        marginTop: 40,
        textAlign: 'center',
        color: '#888',
        fontSize: 10
    }
})

export function ReportDocument({
    customerName,
    city,
    state,
    averageConsumption,
    systemPower,
    panels,
    roofArea,
    monthlySavings,
    estimatedGeneration
}: Props) {

    const yearlySavings =
        monthlySavings * 12

    return (
        <Document>

            <Page
                size="A4"
                style={styles.page}
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <Text style={styles.title}>
                        Relatório Fotovoltaico
                    </Text>

                    <Text style={styles.subtitle}>
                        Simulação de geração solar
                    </Text>

                </View>

                {/* CLIENTE */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Dados do Cliente
                    </Text>

                    <Text>
                        Cliente: {customerName}
                    </Text>

                    <Text>
                        Cidade: {city} - {state}
                    </Text>

                </View>

                {/* RESULTADOS */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Resultado da Simulação
                    </Text>

                    <View style={styles.cardGrid}>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Consumo Médio
                            </Text>

                            <Text style={styles.cardValue}>
                                {averageConsumption.toFixed(0)} kWh
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Potência do Sistema
                            </Text>

                            <Text style={styles.cardValue}>
                                {systemPower.toFixed(2)} kWp
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Quantidade de Placas
                            </Text>

                            <Text style={styles.cardValue}>
                                {panels}
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Área Necessária
                            </Text>

                            <Text style={styles.cardValue}>
                                {roofArea.toFixed(1)} m²
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Geração Estimada
                            </Text>

                            <Text style={styles.cardValue}>
                                {estimatedGeneration.toFixed(2)} kWh/mês
                            </Text>
                        </View>

                    </View>
                </View>

                {/* ECONOMIA */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Economia Estimada
                    </Text>

                    <Text>
                        Economia mensal:
                        R$ {monthlySavings.toFixed(2)}
                    </Text>

                    <Text>
                        Economia anual:
                        R$ {yearlySavings.toFixed(2)}
                    </Text>

                </View>

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Comparativo Energético
                    </Text>

                    <Text>
                        Consumo médio atual:
                        {averageConsumption.toFixed(0)} kWh/mês
                    </Text>

                    <Text>
                        Geração estimada:
                        {estimatedGeneration.toFixed(0)} kWh/mês
                    </Text>

                    <Text>
                        Cobertura estimada:
                        {(
                            (estimatedGeneration /
                                averageConsumption) * 100
                        ).toFixed(0)}%
                    </Text>

                </View>

                {/* RODAPÉ */}

                <View style={styles.footer}>

                    <Text>
                        Relatório gerado automaticamente
                    </Text>

                </View>

            </Page>
        </Document>
    )
}