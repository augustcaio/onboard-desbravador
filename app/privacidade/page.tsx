import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
        <p className="mb-4">
          Esta política de privacidade descreve como o "Clube Quetzal" coleta, usa, divulga e protege as informações pessoais dos usuários ao utilizar nossa aplicação de gerenciamento de desbravadores.
        </p>
        <p className="mb-4">
          Ao acessar ou usar nossa plataforma, você concorda com as práticas descritas nesta política de privacidade.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Informações Coletadas</h2>
        <p className="mb-4">
          Coletamos os seguintes tipos de informações para fornecer e melhorar nossos serviços:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Informações de conta: nome, endereço de e-mail, foto de perfil (obtidas via autenticação Google)</li>
          <li>Informações de perfil: função no clube (desbravador, diretor, instrutor, etc.), unidade, data de ingresso</li>
          <li>Dados de pontuação: atividades realizadas, notas obtidas, conquistas, progresso no cumprimento dos requisitos</li>
          <li>Dados de uso: logs de acesso, preferências de interface, interações com a plataforma</li>
          <li>Informações de calendário: eventos relacionados às atividades do clube (quando integrado com Google Calendar)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
        <p className="mb-4">
          Utilizamos as informações coletadas para:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Autenticar usuários e manter sessões seguras</li>
          <li>Gerenciar perfis de membros e suas atividades</li>
          <li>Calcular e exibir pontuações individuais e de unidade</li>
          <li>Gerar relatórios de desempenho e relatórios gerenciais</li>
          <li>Enviar notificações importantes sobre eventos, prazos e atualizações do clube</li>
          <li>Personalizar a experiência do usuário na plataforma</li>
          <li>Integrar com o Google Calendar para sincronização de eventos</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
        <p className="mb-4">
          Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. No entanto, podemos compartilhar informações em circunstâncias específicas:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Com prestadores de serviços que nos auxiliam na operação da plataforma (ex: serviços de hospedagem)</li>
          <li>Com o Google, exclusivamente para a funcionalidade de integração com Google Calendar (quando autorizada pelo usuário)</li>
          <li>Quando exigido por lei, regulamento ou processo legal válido</li>
          <li>Para proteger nossos direitos, propriedade ou segurança, bem como os de nossos usuários ou outros</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Segurança das Informações</h2>
        <p className="mb-4">
          Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Criptografia de dados em trânsito (HTTPS)</li>
          <li>Armazenamento seguro de credenciais e tokens de acesso</li>
          <li>Controles de acesso rigorosos aos nossos sistemas</li>
          <li>Monitoramento contínuo para detecção de atividades suspeitas</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
        <p className="mb-4">
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Confirmar a existência de tratamento de seus dados pessoais</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a LGPD</li>
          <li>Obter portabilidade de seus dados para outro serviço ou produto</li>
          <li>Revogar seu consentimento para tratamento de dados</li>
        </ul>
        <p className="mb-4">
          Para exercer estes direitos, entre em contato conosco através do e-mail: <a href="mailto:privacidade@clubequetzal.org" className="underline hover:text-primary">privacidade@clubequetzal.org</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Alterações nesta Política</h2>
        <p className="mb-4">
          Podemos atualizar esta política de privacidade periodicamente para refletir mudanças em nossas práticas ou por motivos legais. Notificaremos sobre quaisquer alterações significativas através desta página ou por outros meios apropriados.
        </p>
        <p className="mb-4">
          Esta política foi atualizada pela última vez em: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
        <p className="mb-4">
          Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
        </p>
        <p className="mb-4">
          E-mail: <a href="mailto:privacidade@clubequetzal.org" className="underline hover:text-primary">privacidade@clubequetzal.org</a><br/>
          Endereço: Clube Quetzal - Sistema de Gestão de Desbravadores
        </p>
      </section>
    </div>
  );
}