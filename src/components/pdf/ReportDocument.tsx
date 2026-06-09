import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer'

import eltecLogo from '../../../public/elteclogo.png'

import image from '../../../public/image.png'


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
    monthlyGeneration: number[]
    chartImage?: string
    kitPrice: number
    installationPrice: number
    totalInvestment: number
    paybackYears: number
    annualSavings: number
    descriptionPlacas: string
    descriptionInversor: string
    inversor: string
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
        fontSize: 22,
        marginBottom: 12,
        fontWeight: 'bold'
    },

    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontWeight: 'bold'
    },

    text: {
        marginBottom: 12,
        lineHeight: 1.15,
        textAlign: 'justify'
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
        fontSize: 10,
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        justifyContent: 'space-between',
    },

    chart: {
        marginTop: 12,
        width: '100%',
        height: 250,
        objectFit: 'contain'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 8,
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
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
    estimatedGeneration,
    monthlyGeneration,
    chartImage,
    kitPrice,
    installationPrice,
    totalInvestment,
    paybackYears,
    annualSavings,
    descriptionPlacas,
    descriptionInversor,
    inversor
}: Props) {

    const yearlySavings =
        monthlySavings * 12

    const fiveYearSavings =
        yearlySavings * 5

    return (
        <Document>

            <Page size="A4" style={styles.page}>

                <Image
                    src={`${eltecLogo.src}`}
                    style={{ width: "100%", marginBottom: 20, marginTop: 40 }}
                />

                <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
                    PROPOSTA COMERCIAL
                </Text>

                <View style={styles.section}>

                    <Text style={{ marginTop: 16 }}>
                        Cliente: {customerName}
                    </Text>

                </View>

                <View style={styles.section}>
                    <Text>
                        {city} - {state}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>

            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    ENERGIA SOLAR
                </Text>

                <View style={styles.section}>

                    <Text style={styles.text}>Energia solar fotovoltaica é a captação da luz solar e transformada em energia,
                        considerando que não é o sol que gera a energia e sim o calor dos raios solares.
                        Para que seja convertido os raios solares em energia, é construido uma usina,
                        que é a instalação de placas, sendo essas a responsáveis por captar a energia,
                        após isso é encaminhado para o inversor, ele que faz a conversão de calor dos
                        raios solares em energia.</Text>
                    <Text style={styles.text}>O que é gerado durante o dia, é contabilizado, e descontado no seu gasto
                        diário, da energia disponibilizada pela Concessionária, e caso no dia, seja gerado
                        uma quantidade maior de energia solar fotovoltaica que a energia distruiba pela
                        Concessionária, o remanecente é considerado como credito, e os meses que não
                        conseguir obter o mesmo consumo entre as duas energia ela é utilizada.</Text>

                </View>

                <Image
                    src={`${image.src}`}
                    style={{ width: "100%", marginBottom: 20 }}
                />

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>

            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    CONSUMO E GERAÇÃO
                </Text>

                <Text style={styles.text}>
                    Com base nos dados que foram repassados, foi caluculado o seu consumo
                    médio mensal e anual, segue os dados obtidos abaixo:</Text>

                <View style={styles.table}>
                    <Text style={{ ...styles.cardTitle, marginBottom: 8 }}>
                        Geração Mensal Estimada
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #DDD' }}>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 3, borderRight: '1 solid #DDD' }}>
                            Mês
                        </Text>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 3 }}>
                            Geração Estimada (kWh)
                        </Text>
                    </View>
                    {monthlyGeneration.map((value, index) => (
                        <View key={index} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                            <Text style={{ width: '50%', padding: 3, borderRight: '1 solid #EEE' }}>
                                {`Mês ${index + 1}`}
                            </Text>
                            <Text style={{ width: '50%', padding: 3 }}>
                                {value.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    ))}
                </View>

                {
                    chartImage && (

                        <Image
                            src={chartImage}
                            style={styles.chart}
                        />

                    )
                }

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>
            <Page size="A4" style={styles.page}>

                <Text style={styles.subtitle}>
                    KIT
                </Text>

                <Text style={styles.text}>
                    Baseado no consumo, para que o tenha condição da usina gerar energia
                    suficiente para equiparar os gastos de energia fornecido pela CEMIG, será
                    necessário os seguintes equipamentos e quantidades: </Text>

                <View style={styles.table}>
                    <Text style={{ ...styles.cardTitle, marginBottom: 8 }}>
                        COMPONENTES
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #DDD' }}>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8, borderRight: '1 solid #DDD' }}>
                            Quantidade
                        </Text>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8 }}>
                            Item
                        </Text>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8 }}>
                            Especificação
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {panels}
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Placa Solar
                        </Text>
                        <Text style={{ width: '50%', padding: 8 }}>
                            620W mono half-cell 1500Vc
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            1
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Inversor On-Grid
                        </Text>
                        <Text style={{ width: '50%', padding: 8 }}>
                            3kW/200V WiFi
                        </Text>
                    </View>

                </View>

                <Text style={styles.subtitle}>
                    ECONOMIA PROJETADA
                </Text>

                <View style={styles.section}>

                    <Text style={{ marginBottom: 8 }}>
                        Com base na geração estimada, a economia projetada é a seguinte:
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        Economia Mensal: R$ {monthlySavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Economia Anual: R$ {yearlySavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Economia em 5 anos: R$ {fiveYearSavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Payback: {paybackYears.toFixed(1)} anos
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        CO2 evitado por ano: {(averageConsumption * 0.084 * 12).toFixed(2).replace('.', ',')} Kg
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        Árvores equivalentes plantadas por ano: {(averageConsumption * 0.02).toFixed(0)}
                    </Text>

                </View>

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>

            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    INVESTIMENTO
                </Text>

                <Text style={styles.text}>
                    O valor para ser instalado e adquirido os itens necessário será o seguinte:
                </Text>

                <View style={styles.table}>
                    <Text style={{ ...styles.cardTitle, marginBottom: 8 }}>
                        VALORES
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Kit
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {`R$ ${kitPrice.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Projeto e Instalação
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {`R$ ${installationPrice.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Total
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {`R$ ${totalInvestment.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`}
                        </Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    DETALHES DE PROJETO E EXECUÇÃO
                </Text>
                <Text style={styles.text}>
                    Oferecemos o serviço completo, desde o projeto inicial até a montagem
                    final, com entrega do sistema já em funcionamento! Contamos com uma equipe
                    qualificada que atua sempre sob a supervisão dos nossos engenheiros.</Text>

                <View style={styles.section}>

                    <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
                        Esse escopo inclui:
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Gerador Fotovoltaico;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Serviços de Engenharia e Homologação na concessionária;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Instalação de estrutura metálica e fixação dos painéis;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Instalação elétrica;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Start Up do gerador;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Monitoramento online no seu celular;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Assistência tecnica gratuita por 1 anos.
                    </Text>

                </View>
                <View style={styles.section}>
                    <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
                        Esse escopo NÃO inclui:
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Remoção ou realocação de itens, como aquecedores, antenas caixa
                        d’agua, etc;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Serviços de alvenaria, telhados, ou estruturas de suporte;
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        • Ligação entre gerador fotovoltaico e ponto de conexão além de 20
                        metros.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>

                <Text style={styles.subtitle}>
                    KIT
                </Text>

                <Text style={styles.text}>
                    Baseado no consumo, para que o tenha condição da usina gerar energia
                    suficiente para equiparar os gastos de energia fornecido pela CEMIG, será
                    necessário os seguintes equipamentos e quantidades: </Text>

                <View style={styles.table}>
                    <Text style={{ ...styles.cardTitle, marginBottom: 8 }}>
                        COMPONENTES
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #DDD' }}>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8, borderRight: '1 solid #DDD' }}>
                            Quantidade
                        </Text>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8 }}>
                            Item
                        </Text>
                        <Text style={{ width: '50%', fontWeight: 'bold', padding: 8 }}>
                            Especificação
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {panels}
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            Placa Solar
                        </Text>
                        <Text style={{ width: '50%', padding: 8 }}>
                            {descriptionPlacas}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {
                                inversor==="Microinversor" ? Math.ceil(panels/4) : 1
                            }
                        </Text>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                            {inversor}
                        </Text>
                        <Text style={{ width: '50%', padding: 8 }}>
                            {descriptionInversor}
                        </Text>
                    </View>

                </View>

                <Text style={styles.subtitle}>
                    ECONOMIA PROJETADA
                </Text>

                <View style={styles.section}>

                    <Text style={{ marginBottom: 8 }}>
                        Com base na geração estimada, a economia projetada é a seguinte:
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        Economia Mensal: R$ {monthlySavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Economia Anual: R$ {yearlySavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Economia em 5 anos: R$ {fiveYearSavings.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        Payback: {paybackYears.toFixed(1)} anos
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        CO₂ evitado por ano: {(averageConsumption * 0.084 * 12).toFixed(2).replace('.', ',')} Kg
                    </Text>

                    <Text style={{ marginBottom: 4 }}>
                        Árvores equivalentes plantadas por ano: {(averageConsumption * 0.02).toFixed(0)}
                    </Text>

                </View>

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>

            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    TERMOS E CONDIÇÕES
                </Text>

                <Text style={styles.text}>
                    Os resultados desse relatório foram obtidos com base no simulador PVSyst
                    e os resultados práticos podem diferir certa margem dos resultados simulados.
                    Esses valores são previsões baseadas em modelos probabilísticos de condições
                    de incidência solar e condições de nuvens ao longo do ano.
                </Text>

                <Text style={styles.text}>
                    Qualquer que seja o valor calculado, ainda implica ao cliente o pagamento
                    de taxas na fatura de energia elétrica, como taxa de disponibilidade, custeio da
                    iluminação publica, etc.
                </Text>

                <Text style={styles.text}>
                    Todo o processo será feito em conformidade com a Resolução
                    nº482/2012, normas técnicas vigentes da concessionária local e normas de
                    segurança NBR5410 e NR10.
                </Text>

                <Text style={styles.text}>
                    Este escopo considera que o cliente tenha telhado suficiente disponível
                    na posição ideal sem qualquer tipo de sombreamento.
                </Text>

                <Text style={styles.text}>
                    NOTA: A rede de distribuição local de energia deve ser analisada e aprovada
                    pela concessionária de energia. Havendo necessidade de obras de
                    adequação na rede local de energia, a mesma será de responsabilidade do
                    contratante.
                </Text>

                <Text style={styles.text}>
                    OBS: Essa proposta tem validade de 10 dias da data de emissão.
                </Text>

                <Text style={{ marginTop: 20, textAlign: 'right' }}>
                    Pará de Minas, {new Date().toLocaleDateString('pt-BR')}
                </Text>

                <View style={styles.footer}>
                    <Text>
                        Alan Almeida
                    </Text>
                    <Text>
                        (37) 9 9779-5059
                    </Text>
                </View>

            </Page>
        </Document>
    )
}