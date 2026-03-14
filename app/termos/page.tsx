import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Termos de Serviço</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar e utilizar a plataforma "Clube Quetzal", você concorda em ficar vinculado por estes Termos de Serviço, bem como por todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer parte destes termos, não está autorizado a usar nossa plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
        <p className="mb-4">
          O Clube Quetzal é uma plataforma web destinada ao gerenciamento de atividades de desbravadores, incluindo:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Cadastro e gestão de membros</li>
          <li>Registro e acompanhamento de pontuações</li>
          <li>Visualização de ranking e desempenho</li>
          <li>Integração com calendário para agendamento de eventos</li>
          <li>Geração de relatórios de desempenho</li>
        </ul>
        <p className="mb-4">
          O serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, seja expressa ou implícita.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Obrigações do Usuário</h2>
        <p className="mb-4">
          Ao usar nossa plataforma, você concorda em:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Fornecer informações verdadeiras, precisas, atuais e completas sobre si mesmo durante o cadastro</li>
          <li>Manter e atualizar prontamente seus dados de cadastro para mantê-los verdadeiros, precisos, atuais e completos</li>
          <li>Não usar a plataforma para fins ilegais ou não autorizados</li>
          <li>Não transmitir vírus, malware ou qualquer código prejudicial</li>
          <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
          <li>Não interferir ou interromper o funcionamento dos servidores ou redes conectadas à plataforma</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Uso Adequado da Plataforma</h2>
        <p className="mb-4">
          Você concorda em usar a plataforma exclusivamente para:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Gerenciar suas atividades como desbravador ou diretor</li>
          <li>Acompanhar seu progresso e pontuação no cumprimento dos requisitos</li>
          <li>Participar das atividades do clube de forma colaborativa</li>
          <li>Acessar informações relevantes sobre eventos e atividades</li>
        </ul>
        <p className="mb-4">
          É proibido usar a plataforma para:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Qualquer atividade comercial não autorizada</li>
          <li>Coleta não autorizada de informações de outros usuários</li>
          <li>Spam, phishing ou outras atividades maliciosas</li>
          <li>Violação de privacidade de outros usuários</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Propriedade Intelectual</h2>
        <p className="mb-4">
          Todo o conteúdo presente na plataforma Clube Quetzal, incluindo, mas não se limitando a, textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilados de dados, é propriedade exclusiva do Clube Quetzal ou de seus fornecedores de conteúdo e é protegido pelas leis brasileiras e internacionais de direitos autorais.
        </p>
        <p className="mb-4">
          A compilação (ou seja, a coleta, arrumação e montagem) de todo o conteúdo desta plataforma é a propriedade exclusiva do Clube Quetzal e é protegida pelas leis brasileiras e internacionais de direitos autorais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitação de Responsabilidade</h2>
        <p className="mb-4">
          Em nenhum caso o Clube Quetzal, seus diretores, funcionários ou agentes serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros ou receitas, decorrentes de ou relacionados ao seu uso ou incapacidade de usar nossa plataforma, mesmo que o Clube Quetzal tenha sido informado da possibilidade de tais danos.
        </p>
        <p className="mb-4">
          Nossa responsabilidade máxima decorrente de ou relacionada à sua utilização da plataforma será limitada ao valor pago por você, se houver, pelos serviços durante o período de três (3) meses anteriores à ocorrência do evento que deu origem à responsabilidade.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Modificações nos Termos</h2>
        <p className="mb-4">
          Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos de Serviço a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes de os novos termos entrarem em vigor. O que constitui uma mudança material será determinado a nosso exclusivo critério.
        </p>
        <p className="mb-4">
          Ao continuar a acessar ou usar nossa plataforma após a entrada em vigor de quaisquer revisões destes termos, você aceita e concorda em ficar vinculado pelos termos revisados.
        </p>
        <p className="mb-4">
          Estes termos foram atualizados pela última vez em: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Lei Aplicável e Foro</h2>
        <p className="mb-4">
          Estes Termos de Serviço serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, sem considerar seus princípios de conflito de leis.
        </p>
        <p className="mb-4">
          Qualquer disputa decorrente ou relacionada a estes Termos de Serviço será submetida à jurisdição exclusiva dos tribunais localizados na cidade de [CIDADE], [ESTADO], Brasil.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
        <p className="mb-4">
          Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
        </p>
        <p className="mb-4">
          E-mail: <a href="mailto:termos@clubequetzal.org" className="underline hover:text-primary">termos@clubequetzal.org</a><br/>
          Endereço: Clube Quetzal - Sistema de Gestão de Desbravadores
        </p>
      </section>
    </div>
  );
}