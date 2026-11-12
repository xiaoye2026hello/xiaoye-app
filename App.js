import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const FONT = Platform.select({
  ios: 'PingFang SC',
  android: 'sans-serif',
  default: 'sans-serif',
});

const C = {
  bg: '#0B1220',
  card: '#141E30',
  border: '#1E2A3D',
  text: '#EAF2FF',
  sub: '#8B99AC',
  mute: '#5A6779',
};

const CATEGORIES = [
  { id: 'all', name: '全部', color: '#8B99AC' },
  { id: 'efficiency', name: '效率', color: '#2F6BFF' },
  { id: 'dev', name: '开发', color: '#7C5CFF' },
  { id: 'design', name: '设计', color: '#E8608C' },
  { id: 'system', name: '系统', color: '#2FBFA8' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const APPS = [
  { name: 'Notion', cat: 'efficiency', desc: '文档、表格、项目看板合一', tags: ['笔记', '协作'] },
  { name: 'Obsidian', cat: 'efficiency', desc: '本地优先的 Markdown 知识库', tags: ['笔记', '离线'] },
  { name: 'Raycast', cat: 'efficiency', desc: '键盘唤起一切的启动器', tags: ['启动器'] },
  { name: 'Cubox', cat: 'efficiency', desc: '收藏网页并永久保存内容', tags: ['收藏', '阅读'] },
  { name: 'VS Code', cat: 'dev', desc: '可扩展的代码编辑器', tags: ['编辑器'] },
  { name: 'Warp', cat: 'dev', desc: '重新设计的现代终端', tags: ['终端'] },
  { name: 'Postman', cat: 'dev', desc: '接口调试与文档协作', tags: ['API'] },
  { name: 'Docker', cat: 'dev', desc: '把运行环境打包带走', tags: ['容器'] },
  { name: 'Figma', cat: 'design', desc: '多人同时编辑的界面设计工具', tags: ['UI', '协作'] },
  { name: 'Affinity', cat: 'design', desc: '一次买断的图像处理套件', tags: ['修图'] },
  { name: 'Blender', cat: 'design', desc: '从建模到渲染的完整三维管线', tags: ['3D'] },
  { name: 'Rectangle', cat: 'system', desc: '用快捷键把窗口摆到固定位置', tags: ['窗口'] },
  { name: 'Maccy', cat: 'system', desc: '轻量的剪贴板历史记录', tags: ['剪贴板'] },
  { name: 'Keka', cat: 'system', desc: '支持多种格式的压缩解压工具', tags: ['压缩'] },
];

function AppCard({ item }) {
  const c = CAT_MAP[item.cat];
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.avatar, { backgroundColor: c.color + '26' }]}>
        <Text style={[styles.avatarText, { color: c.color }]}>{item.name.charAt(0)}</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
      <View style={styles.tagRow}>
        {item.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export default function App() {
  const [active, setActive] = useState('all');
  const list = active === 'all' ? APPS : APPS.filter((a) => a.cat === active);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>软件库</Text>
        <Text style={styles.subtitle}>精选 {APPS.length} 款实用工具</Text>

        <View style={styles.filterRow}>
          {CATEGORIES.map((c) => {
            const on = c.id === active;
            return (
              <Pressable
                key={c.id}
                onPress={() => setActive(c.id)}
                style={[styles.chip, on && { backgroundColor: c.color, borderColor: c.color }]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.count}>{list.length} 个结果</Text>

        <View style={styles.grid}>
          {list.map((item) => (
            <AppCard key={item.name} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingTop: 72,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 34,
    fontWeight: '500',
    color: C.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 6,
    fontSize: 14,
    color: C.sub,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
  },
  chipText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 13,
    color: C.sub,
  },
  chipTextOn: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  count: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 22,
    fontSize: 12,
    color: C.mute,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  card: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  cardPressed: {
    backgroundColor: '#1A2740',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 20,
    fontWeight: '500',
  },
  cardTitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 15,
    fontWeight: '500',
    color: C.text,
  },
  cardDesc: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: C.sub,
    minHeight: 36,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#1B2537',
  },
  tagText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 10,
    color: C.mute,
  },
});
