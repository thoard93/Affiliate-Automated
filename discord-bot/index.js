/**
 * Affiliate Automated Discord Bot
 * 
 * Commands:
 * - /connect - Connect TikTok Shop account
 * - /status - Check connection status and earnings
 * - /products - Browse boosted products
 * - /alerts - Manage notification preferences
 */

const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma
const prisma = new PrismaClient();

// Discord client configuration
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

// Branding colors
const BRAND_COLORS = {
  ORANGE: 0xFF6B00,
  GOLD: 0xFFD700,
  SUCCESS: 0x00C853,
  ERROR: 0xFF4444,
};

// Slash commands definition
const commands = [
  new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connect your TikTok Shop creator account'),
  
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check your connection status and earnings summary'),
  
  new SlashCommandBuilder()
    .setName('products')
    .setDescription('Browse boosted commission products')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Filter by category')
        .setRequired(false)
        .addChoices(
          { name: 'All Categories', value: 'all' },
          { name: 'Kitchen & Dining', value: 'Kitchen & Dining' },
          { name: 'Home & Garden', value: 'Home & Garden' },
          { name: 'Electronics', value: 'Electronics' },
          { name: 'Beauty', value: 'Beauty' },
          { name: 'Sports & Fitness', value: 'Sports & Fitness' },
        )
    )
    .addStringOption(option =>
      option
        .setName('sort')
        .setDescription('Sort products by')
        .setRequired(false)
        .addChoices(
          { name: 'Highest Bonus', value: 'bonus-high' },
          { name: 'Lowest Price', value: 'price-low' },
          { name: 'Most Stock', value: 'stock-high' },
        )
    ),
  
  new SlashCommandBuilder()
    .setName('alerts')
    .setDescription('Manage your notification preferences')
    .addSubcommand(subcommand =>
      subcommand
        .setName('on')
        .setDescription('Enable notifications')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('off')
        .setDescription('Disable notifications')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check notification status')
    ),

  new SlashCommandBuilder()
    .setName('earnings')
    .setDescription('View your earnings summary'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with Affiliate Automated commands'),
];

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  
  try {
    console.log('🔄 Registering slash commands...');
    
    // Register globally (or use guildId for faster testing)
    if (process.env.DISCORD_GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
        { body: commands.map(c => c.toJSON()) }
      );
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands.map(c => c.toJSON()) }
      );
    }
    
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
}

// Command handlers
async function handleConnect(interaction) {
  const discordUserId = interaction.user.id;
  
  // Check if already connected
  const existingCreator = await prisma.creator.findFirst({
    where: { discordUserId },
    include: { user: true },
  });
  
  if (existingCreator?.tiktokConnected) {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.SUCCESS)
      .setTitle('✅ Already Connected')
      .setDescription(`Your TikTok Shop account **${existingCreator.tiktokUsername || 'Unknown'}** is already connected.`)
      .addFields(
        { name: 'Status', value: existingCreator.user.status, inline: true },
        { name: 'Connected Since', value: existingCreator.createdAt.toLocaleDateString(), inline: true },
      )
      .setFooter({ text: 'Affiliate Automated' });
    
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  // Generate connection URL
  const connectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?discord=${discordUserId}`;
  
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLORS.ORANGE)
    .setTitle('🔗 Connect TikTok Shop')
    .setDescription('Click the button below to connect your TikTok Shop creator account and start earning boosted commissions!')
    .addFields(
      { name: '📈 Benefits', value: '• 5-8% higher commission rates\n• Instant product alerts\n• Real-time earnings tracking\n• One-click showcase adding' },
    )
    .setFooter({ text: 'Affiliate Automated • Market Mix Media LLC' });
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Connect Account')
        .setStyle(ButtonStyle.Link)
        .setURL(connectUrl)
        .setEmoji('🚀')
    );
  
  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleStatus(interaction) {
  const discordUserId = interaction.user.id;
  
  const creator = await prisma.creator.findFirst({
    where: { discordUserId },
    include: {
      user: true,
      commissionEvents: {
        where: { status: { in: ['PENDING', 'CONFIRMED'] } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      showcaseItems: {
        where: { status: 'ADDED' },
      },
    },
  });
  
  if (!creator) {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.ERROR)
      .setTitle('❌ Not Connected')
      .setDescription('You haven\'t connected your account yet. Use `/connect` to get started!')
      .setFooter({ text: 'Affiliate Automated' });
    
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  // Calculate earnings
  const totalEarnings = creator.commissionEvents.reduce((sum, e) => 
    sum + parseFloat(e.commissionAmount.toString()), 0
  );
  const pendingEarnings = creator.commissionEvents
    .filter(e => e.status === 'PENDING')
    .reduce((sum, e) => sum + parseFloat(e.commissionAmount.toString()), 0);
  
  const statusEmoji = creator.user.status === 'APPROVED' ? '✅' : 
                      creator.user.status === 'PENDING' ? '⏳' : '❌';
  const tiktokEmoji = creator.tiktokConnected ? '✅' : '❌';
  
  const embed = new EmbedBuilder()
    .setColor(creator.user.status === 'APPROVED' ? BRAND_COLORS.SUCCESS : BRAND_COLORS.ORANGE)
    .setTitle(`📊 Status for ${interaction.user.username}`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
      { name: 'Account Status', value: `${statusEmoji} ${creator.user.status}`, inline: true },
      { name: 'TikTok Shop', value: `${tiktokEmoji} ${creator.tiktokConnected ? 'Connected' : 'Not Connected'}`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: '💰 Total Earnings', value: `$${totalEarnings.toFixed(2)}`, inline: true },
      { name: '⏳ Pending', value: `$${pendingEarnings.toFixed(2)}`, inline: true },
      { name: '📦 Products', value: `${creator.showcaseItems.length} in showcase`, inline: true },
    )
    .setFooter({ text: 'Affiliate Automated' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleProducts(interaction) {
  const category = interaction.options.getString('category') || 'all';
  const sort = interaction.options.getString('sort') || 'bonus-high';
  
  await interaction.deferReply({ ephemeral: true });
  
  // Build query
  const where = { status: 'ACTIVE' };
  if (category !== 'all') {
    where.category = category;
  }
  
  // Build orderBy
  let orderBy = {};
  switch (sort) {
    case 'bonus-high':
      orderBy = { bonusRate: 'desc' };
      break;
    case 'price-low':
      orderBy = { priceMin: 'asc' };
      break;
    case 'stock-high':
      orderBy = { stockCount: 'desc' };
      break;
  }
  
  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: 5,
  });
  
  if (products.length === 0) {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.ORANGE)
      .setTitle('📦 No Products Found')
      .setDescription('No products match your criteria. Try adjusting your filters.')
      .setFooter({ text: 'Affiliate Automated' });
    
    return interaction.editReply({ embeds: [embed] });
  }
  
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLORS.ORANGE)
    .setTitle('🔥 Boosted Commission Products')
    .setDescription(`Showing top ${products.length} products${category !== 'all' ? ` in **${category}**` : ''}`)
    .setFooter({ text: 'Affiliate Automated • Use /products for more options' });
  
  products.forEach((product, i) => {
    const bonusPercent = (parseFloat(product.bonusRate.toString()) * 100).toFixed(0);
    const aaPercent = (parseFloat(product.aaCommissionRate.toString()) * 100).toFixed(0);
    const openPercent = (parseFloat(product.openCollabRate.toString()) * 100).toFixed(0);
    
    embed.addFields({
      name: `${i + 1}. ${product.name.substring(0, 50)}${product.name.length > 50 ? '...' : ''}`,
      value: `💰 **${aaPercent}%** AA Rate (vs ${openPercent}% Open) • +${bonusPercent}% Bonus\n💵 $${parseFloat(product.priceMin.toString()).toFixed(2)} - $${parseFloat(product.priceMax.toString()).toFixed(2)} • 📦 ${product.stockCount.toLocaleString()} in stock${product.freeSampleAvailable ? ' • 🎁 Free Sample' : ''}`,
      inline: false,
    });
  });
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('View All Products')
        .setStyle(ButtonStyle.Link)
        .setURL(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/products`)
        .setEmoji('🛒')
    );
  
  await interaction.editReply({ embeds: [embed], components: [row] });
}

async function handleAlerts(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const discordUserId = interaction.user.id;
  
  const creator = await prisma.creator.findFirst({
    where: { discordUserId },
  });
  
  if (!creator) {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.ERROR)
      .setTitle('❌ Not Connected')
      .setDescription('You need to connect your account first. Use `/connect` to get started!')
      .setFooter({ text: 'Affiliate Automated' });
    
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  let embed;
  
  switch (subcommand) {
    case 'on':
      await prisma.creator.update({
        where: { id: creator.id },
        data: { notificationsEnabled: true },
      });
      embed = new EmbedBuilder()
        .setColor(BRAND_COLORS.SUCCESS)
        .setTitle('🔔 Notifications Enabled')
        .setDescription('You will now receive alerts for:\n• New boosted products\n• Sales notifications\n• Payout updates')
        .setFooter({ text: 'Affiliate Automated' });
      break;
    
    case 'off':
      await prisma.creator.update({
        where: { id: creator.id },
        data: { notificationsEnabled: false },
      });
      embed = new EmbedBuilder()
        .setColor(BRAND_COLORS.ORANGE)
        .setTitle('🔕 Notifications Disabled')
        .setDescription('You will no longer receive Discord alerts. Use `/alerts on` to re-enable.')
        .setFooter({ text: 'Affiliate Automated' });
      break;
    
    case 'status':
      embed = new EmbedBuilder()
        .setColor(creator.notificationsEnabled ? BRAND_COLORS.SUCCESS : BRAND_COLORS.ORANGE)
        .setTitle('🔔 Notification Status')
        .setDescription(`Notifications are currently **${creator.notificationsEnabled ? 'enabled' : 'disabled'}**.`)
        .addFields(
          { name: 'Commands', value: '• `/alerts on` - Enable notifications\n• `/alerts off` - Disable notifications' }
        )
        .setFooter({ text: 'Affiliate Automated' });
      break;
  }
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleEarnings(interaction) {
  const discordUserId = interaction.user.id;
  
  const creator = await prisma.creator.findFirst({
    where: { discordUserId },
    include: {
      commissionEvents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  if (!creator) {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.ERROR)
      .setTitle('❌ Not Connected')
      .setDescription('You need to connect your account first. Use `/connect` to get started!')
      .setFooter({ text: 'Affiliate Automated' });
    
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  // Calculate earnings by status
  const byStatus = {
    PENDING: 0,
    CONFIRMED: 0,
    PAID: 0,
  };
  
  creator.commissionEvents.forEach(event => {
    if (byStatus[event.status] !== undefined) {
      byStatus[event.status] += parseFloat(event.commissionAmount.toString());
    }
  });
  
  const total = byStatus.PENDING + byStatus.CONFIRMED + byStatus.PAID;
  
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLORS.GOLD)
    .setTitle('💰 Earnings Summary')
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
      { name: '📊 Total Earnings', value: `**$${total.toFixed(2)}**`, inline: false },
      { name: '⏳ Pending', value: `$${byStatus.PENDING.toFixed(2)}`, inline: true },
      { name: '✅ Confirmed', value: `$${byStatus.CONFIRMED.toFixed(2)}`, inline: true },
      { name: '💵 Paid Out', value: `$${byStatus.PAID.toFixed(2)}`, inline: true },
    )
    .setFooter({ text: 'Affiliate Automated • Payouts on the 15th of each month' })
    .setTimestamp();
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('View Detailed Earnings')
        .setStyle(ButtonStyle.Link)
        .setURL(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/earnings`)
        .setEmoji('📈')
    );
  
  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleHelp(interaction) {
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLORS.ORANGE)
    .setTitle('🤖 Affiliate Automated Commands')
    .setDescription('Access exclusive boosted commission rates on TikTok Shop products!')
    .addFields(
      { name: '/connect', value: 'Connect your TikTok Shop creator account', inline: false },
      { name: '/status', value: 'Check your connection status and summary', inline: false },
      { name: '/products', value: 'Browse boosted commission products', inline: false },
      { name: '/earnings', value: 'View your earnings summary', inline: false },
      { name: '/alerts on|off|status', value: 'Manage notification preferences', inline: false },
      { name: '/help', value: 'Show this help message', inline: false },
    )
    .setFooter({ text: 'Affiliate Automated • Market Mix Media LLC' })
    .setTimestamp();
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Open Dashboard')
        .setStyle(ButtonStyle.Link)
        .setURL(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
        .setEmoji('🚀'),
      new ButtonBuilder()
        .setLabel('Support')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/affiliateautomated')
        .setEmoji('💬')
    );
  
  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

// Event handlers
client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
  
  // Set status
  client.user.setActivity('TikTok Shop commissions', { type: 'WATCHING' });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  try {
    switch (interaction.commandName) {
      case 'connect':
        await handleConnect(interaction);
        break;
      case 'status':
        await handleStatus(interaction);
        break;
      case 'products':
        await handleProducts(interaction);
        break;
      case 'alerts':
        await handleAlerts(interaction);
        break;
      case 'earnings':
        await handleEarnings(interaction);
        break;
      case 'help':
        await handleHelp(interaction);
        break;
    }
  } catch (error) {
    console.error(`Error handling /${interaction.commandName}:`, error);
    
    const errorEmbed = new EmbedBuilder()
      .setColor(BRAND_COLORS.ERROR)
      .setTitle('❌ Error')
      .setDescription('An error occurred while processing your command. Please try again.')
      .setFooter({ text: 'Affiliate Automated' });
    
    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

// Notification functions (exported for use by other services)
async function sendProductAlert(discordUserId, product) {
  try {
    const user = await client.users.fetch(discordUserId);
    
    const bonusPercent = (parseFloat(product.bonusRate.toString()) * 100).toFixed(0);
    const aaPercent = (parseFloat(product.aaCommissionRate.toString()) * 100).toFixed(0);
    
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.GOLD)
      .setTitle('🔥 New Boosted Product!')
      .setDescription(`**${product.name}**`)
      .addFields(
        { name: 'Commission Rate', value: `${aaPercent}% (+${bonusPercent}% bonus)`, inline: true },
        { name: 'Price', value: `$${parseFloat(product.priceMin.toString()).toFixed(2)}`, inline: true },
        { name: 'Stock', value: product.stockCount.toLocaleString(), inline: true },
      )
      .setFooter({ text: 'Affiliate Automated' })
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Add to Showcase')
          .setStyle(ButtonStyle.Link)
          .setURL(product.deepLink || `https://www.tiktok.com/view/product/${product.tiktokProductId}`)
          .setEmoji('➕')
      );
    
    await user.send({ embeds: [embed], components: [row] });
    return true;
  } catch (error) {
    console.error('Failed to send product alert:', error);
    return false;
  }
}

async function sendSaleAlert(discordUserId, sale) {
  try {
    const user = await client.users.fetch(discordUserId);
    
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLORS.SUCCESS)
      .setTitle('💰 New Sale!')
      .setDescription(`You just made a sale on **${sale.productName}**!`)
      .addFields(
        { name: 'Order Amount', value: `$${sale.orderAmount.toFixed(2)}`, inline: true },
        { name: 'Your Commission', value: `$${sale.commissionAmount.toFixed(2)}`, inline: true },
      )
      .setFooter({ text: 'Affiliate Automated' })
      .setTimestamp();
    
    await user.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error('Failed to send sale alert:', error);
    return false;
  }
}

// Start bot
async function startBot() {
  await registerCommands();
  await client.login(process.env.DISCORD_BOT_TOKEN);
}

// Export for external use
module.exports = {
  client,
  startBot,
  sendProductAlert,
  sendSaleAlert,
};

// Start if running directly
if (require.main === module) {
  startBot().catch(console.error);
}
