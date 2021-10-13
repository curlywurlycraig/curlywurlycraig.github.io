// Compiled by ClojureScript 1.10.758 {:target :nodejs}
goog.provide('cljs.repl');
goog.require('cljs.core');
goog.require('cljs.spec.alpha');
goog.require('goog.string');
goog.require('goog.string.format');
cljs.repl.print_doc = (function cljs$repl$print_doc(p__4006){
var map__4007 = p__4006;
var map__4007__$1 = (((((!((map__4007 == null))))?(((((map__4007.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4007.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4007):map__4007);
var m = map__4007__$1;
var n = cljs.core.get.call(null,map__4007__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var nm = cljs.core.get.call(null,map__4007__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.println.call(null,"-------------------------");

cljs.core.println.call(null,(function (){var or__4126__auto__ = new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return [(function (){var temp__5753__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__5753__auto__)){
var ns = temp__5753__auto__;
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns),"/"].join('');
} else {
return null;
}
})(),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join('');
}
})());

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Protocol");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__4009_4041 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__4010_4042 = null;
var count__4011_4043 = (0);
var i__4012_4044 = (0);
while(true){
if((i__4012_4044 < count__4011_4043)){
var f_4045 = cljs.core._nth.call(null,chunk__4010_4042,i__4012_4044);
cljs.core.println.call(null,"  ",f_4045);


var G__4046 = seq__4009_4041;
var G__4047 = chunk__4010_4042;
var G__4048 = count__4011_4043;
var G__4049 = (i__4012_4044 + (1));
seq__4009_4041 = G__4046;
chunk__4010_4042 = G__4047;
count__4011_4043 = G__4048;
i__4012_4044 = G__4049;
continue;
} else {
var temp__5753__auto___4050 = cljs.core.seq.call(null,seq__4009_4041);
if(temp__5753__auto___4050){
var seq__4009_4051__$1 = temp__5753__auto___4050;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4009_4051__$1)){
var c__4556__auto___4052 = cljs.core.chunk_first.call(null,seq__4009_4051__$1);
var G__4053 = cljs.core.chunk_rest.call(null,seq__4009_4051__$1);
var G__4054 = c__4556__auto___4052;
var G__4055 = cljs.core.count.call(null,c__4556__auto___4052);
var G__4056 = (0);
seq__4009_4041 = G__4053;
chunk__4010_4042 = G__4054;
count__4011_4043 = G__4055;
i__4012_4044 = G__4056;
continue;
} else {
var f_4057 = cljs.core.first.call(null,seq__4009_4051__$1);
cljs.core.println.call(null,"  ",f_4057);


var G__4058 = cljs.core.next.call(null,seq__4009_4051__$1);
var G__4059 = null;
var G__4060 = (0);
var G__4061 = (0);
seq__4009_4041 = G__4058;
chunk__4010_4042 = G__4059;
count__4011_4043 = G__4060;
i__4012_4044 = G__4061;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_4062 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__4126__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.call(null,arglists_4062);
} else {
cljs.core.prn.call(null,((cljs.core._EQ_.call(null,new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first.call(null,arglists_4062)))?cljs.core.second.call(null,arglists_4062):arglists_4062));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Special Form");

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.contains_QMARK_.call(null,m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.call(null,["\n  Please see http://clojure.org/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))].join(''));
} else {
return null;
}
} else {
return cljs.core.println.call(null,["\n  Please see http://clojure.org/special_forms#",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Macro");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Spec");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"REPL Special Function");
} else {
}

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__4013_4063 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__4014_4064 = null;
var count__4015_4065 = (0);
var i__4016_4066 = (0);
while(true){
if((i__4016_4066 < count__4015_4065)){
var vec__4027_4067 = cljs.core._nth.call(null,chunk__4014_4064,i__4016_4066);
var name_4068 = cljs.core.nth.call(null,vec__4027_4067,(0),null);
var map__4030_4069 = cljs.core.nth.call(null,vec__4027_4067,(1),null);
var map__4030_4070__$1 = (((((!((map__4030_4069 == null))))?(((((map__4030_4069.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4030_4069.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4030_4069):map__4030_4069);
var doc_4071 = cljs.core.get.call(null,map__4030_4070__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_4072 = cljs.core.get.call(null,map__4030_4070__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name_4068);

cljs.core.println.call(null," ",arglists_4072);

if(cljs.core.truth_(doc_4071)){
cljs.core.println.call(null," ",doc_4071);
} else {
}


var G__4073 = seq__4013_4063;
var G__4074 = chunk__4014_4064;
var G__4075 = count__4015_4065;
var G__4076 = (i__4016_4066 + (1));
seq__4013_4063 = G__4073;
chunk__4014_4064 = G__4074;
count__4015_4065 = G__4075;
i__4016_4066 = G__4076;
continue;
} else {
var temp__5753__auto___4077 = cljs.core.seq.call(null,seq__4013_4063);
if(temp__5753__auto___4077){
var seq__4013_4078__$1 = temp__5753__auto___4077;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4013_4078__$1)){
var c__4556__auto___4079 = cljs.core.chunk_first.call(null,seq__4013_4078__$1);
var G__4080 = cljs.core.chunk_rest.call(null,seq__4013_4078__$1);
var G__4081 = c__4556__auto___4079;
var G__4082 = cljs.core.count.call(null,c__4556__auto___4079);
var G__4083 = (0);
seq__4013_4063 = G__4080;
chunk__4014_4064 = G__4081;
count__4015_4065 = G__4082;
i__4016_4066 = G__4083;
continue;
} else {
var vec__4032_4084 = cljs.core.first.call(null,seq__4013_4078__$1);
var name_4085 = cljs.core.nth.call(null,vec__4032_4084,(0),null);
var map__4035_4086 = cljs.core.nth.call(null,vec__4032_4084,(1),null);
var map__4035_4087__$1 = (((((!((map__4035_4086 == null))))?(((((map__4035_4086.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4035_4086.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4035_4086):map__4035_4086);
var doc_4088 = cljs.core.get.call(null,map__4035_4087__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_4089 = cljs.core.get.call(null,map__4035_4087__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name_4085);

cljs.core.println.call(null," ",arglists_4089);

if(cljs.core.truth_(doc_4088)){
cljs.core.println.call(null," ",doc_4088);
} else {
}


var G__4090 = cljs.core.next.call(null,seq__4013_4078__$1);
var G__4091 = null;
var G__4092 = (0);
var G__4093 = (0);
seq__4013_4063 = G__4090;
chunk__4014_4064 = G__4091;
count__4015_4065 = G__4092;
i__4016_4066 = G__4093;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(n)){
var temp__5753__auto__ = cljs.spec.alpha.get_spec.call(null,cljs.core.symbol.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.ns_name.call(null,n)),cljs.core.name.call(null,nm)));
if(cljs.core.truth_(temp__5753__auto__)){
var fnspec = temp__5753__auto__;
cljs.core.print.call(null,"Spec");

var seq__4037 = cljs.core.seq.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"args","args",1315556576),new cljs.core.Keyword(null,"ret","ret",-468222814),new cljs.core.Keyword(null,"fn","fn",-1175266204)], null));
var chunk__4038 = null;
var count__4039 = (0);
var i__4040 = (0);
while(true){
if((i__4040 < count__4039)){
var role = cljs.core._nth.call(null,chunk__4038,i__4040);
var temp__5753__auto___4094__$1 = cljs.core.get.call(null,fnspec,role);
if(cljs.core.truth_(temp__5753__auto___4094__$1)){
var spec_4095 = temp__5753__auto___4094__$1;
cljs.core.print.call(null,["\n ",cljs.core.name.call(null,role),":"].join(''),cljs.spec.alpha.describe.call(null,spec_4095));
} else {
}


var G__4096 = seq__4037;
var G__4097 = chunk__4038;
var G__4098 = count__4039;
var G__4099 = (i__4040 + (1));
seq__4037 = G__4096;
chunk__4038 = G__4097;
count__4039 = G__4098;
i__4040 = G__4099;
continue;
} else {
var temp__5753__auto____$1 = cljs.core.seq.call(null,seq__4037);
if(temp__5753__auto____$1){
var seq__4037__$1 = temp__5753__auto____$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4037__$1)){
var c__4556__auto__ = cljs.core.chunk_first.call(null,seq__4037__$1);
var G__4100 = cljs.core.chunk_rest.call(null,seq__4037__$1);
var G__4101 = c__4556__auto__;
var G__4102 = cljs.core.count.call(null,c__4556__auto__);
var G__4103 = (0);
seq__4037 = G__4100;
chunk__4038 = G__4101;
count__4039 = G__4102;
i__4040 = G__4103;
continue;
} else {
var role = cljs.core.first.call(null,seq__4037__$1);
var temp__5753__auto___4104__$2 = cljs.core.get.call(null,fnspec,role);
if(cljs.core.truth_(temp__5753__auto___4104__$2)){
var spec_4105 = temp__5753__auto___4104__$2;
cljs.core.print.call(null,["\n ",cljs.core.name.call(null,role),":"].join(''),cljs.spec.alpha.describe.call(null,spec_4105));
} else {
}


var G__4106 = cljs.core.next.call(null,seq__4037__$1);
var G__4107 = null;
var G__4108 = (0);
var G__4109 = (0);
seq__4037 = G__4106;
chunk__4038 = G__4107;
count__4039 = G__4108;
i__4040 = G__4109;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Constructs a data representation for a Error with keys:
 *  :cause - root cause message
 *  :phase - error phase
 *  :via - cause chain, with cause keys:
 *           :type - exception class symbol
 *           :message - exception message
 *           :data - ex-data
 *           :at - top stack element
 *  :trace - root cause stack elements
 */
cljs.repl.Error__GT_map = (function cljs$repl$Error__GT_map(o){
var base = (function (t){
return cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),(((t instanceof cljs.core.ExceptionInfo))?new cljs.core.Symbol(null,"ExceptionInfo","ExceptionInfo",294935087,null):(((t instanceof Error))?cljs.core.symbol.call(null,"js",t.name):null
))], null),(function (){var temp__5753__auto__ = cljs.core.ex_message.call(null,t);
if(cljs.core.truth_(temp__5753__auto__)){
var msg = temp__5753__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"message","message",-406056002),msg], null);
} else {
return null;
}
})(),(function (){var temp__5753__auto__ = cljs.core.ex_data.call(null,t);
if(cljs.core.truth_(temp__5753__auto__)){
var ed = temp__5753__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),ed], null);
} else {
return null;
}
})());
});
var via = (function (){var via = cljs.core.PersistentVector.EMPTY;
var t = o;
while(true){
if(cljs.core.truth_(t)){
var G__4110 = cljs.core.conj.call(null,via,t);
var G__4111 = cljs.core.ex_cause.call(null,t);
via = G__4110;
t = G__4111;
continue;
} else {
return via;
}
break;
}
})();
var root = cljs.core.peek.call(null,via);
return cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"via","via",-1904457336),cljs.core.vec.call(null,cljs.core.map.call(null,base,via)),new cljs.core.Keyword(null,"trace","trace",-1082747415),null], null),(function (){var temp__5753__auto__ = cljs.core.ex_message.call(null,root);
if(cljs.core.truth_(temp__5753__auto__)){
var root_msg = temp__5753__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cause","cause",231901252),root_msg], null);
} else {
return null;
}
})(),(function (){var temp__5753__auto__ = cljs.core.ex_data.call(null,root);
if(cljs.core.truth_(temp__5753__auto__)){
var data = temp__5753__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),data], null);
} else {
return null;
}
})(),(function (){var temp__5753__auto__ = new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358).cljs$core$IFn$_invoke$arity$1(cljs.core.ex_data.call(null,o));
if(cljs.core.truth_(temp__5753__auto__)){
var phase = temp__5753__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"phase","phase",575722892),phase], null);
} else {
return null;
}
})());
});
/**
 * Returns an analysis of the phase, error, cause, and location of an error that occurred
 *   based on Throwable data, as returned by Throwable->map. All attributes other than phase
 *   are optional:
 *  :clojure.error/phase - keyword phase indicator, one of:
 *    :read-source :compile-syntax-check :compilation :macro-syntax-check :macroexpansion
 *    :execution :read-eval-result :print-eval-result
 *  :clojure.error/source - file name (no path)
 *  :clojure.error/line - integer line number
 *  :clojure.error/column - integer column number
 *  :clojure.error/symbol - symbol being expanded/compiled/invoked
 *  :clojure.error/class - cause exception class symbol
 *  :clojure.error/cause - cause exception message
 *  :clojure.error/spec - explain-data for spec error
 */
cljs.repl.ex_triage = (function cljs$repl$ex_triage(datafied_throwable){
var map__4114 = datafied_throwable;
var map__4114__$1 = (((((!((map__4114 == null))))?(((((map__4114.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4114.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4114):map__4114);
var via = cljs.core.get.call(null,map__4114__$1,new cljs.core.Keyword(null,"via","via",-1904457336));
var trace = cljs.core.get.call(null,map__4114__$1,new cljs.core.Keyword(null,"trace","trace",-1082747415));
var phase = cljs.core.get.call(null,map__4114__$1,new cljs.core.Keyword(null,"phase","phase",575722892),new cljs.core.Keyword(null,"execution","execution",253283524));
var map__4115 = cljs.core.last.call(null,via);
var map__4115__$1 = (((((!((map__4115 == null))))?(((((map__4115.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4115.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4115):map__4115);
var type = cljs.core.get.call(null,map__4115__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var message = cljs.core.get.call(null,map__4115__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var data = cljs.core.get.call(null,map__4115__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__4116 = data;
var map__4116__$1 = (((((!((map__4116 == null))))?(((((map__4116.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4116.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4116):map__4116);
var problems = cljs.core.get.call(null,map__4116__$1,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814));
var fn = cljs.core.get.call(null,map__4116__$1,new cljs.core.Keyword("cljs.spec.alpha","fn","cljs.spec.alpha/fn",408600443));
var caller = cljs.core.get.call(null,map__4116__$1,new cljs.core.Keyword("cljs.spec.test.alpha","caller","cljs.spec.test.alpha/caller",-398302390));
var map__4117 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.first.call(null,via));
var map__4117__$1 = (((((!((map__4117 == null))))?(((((map__4117.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4117.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4117):map__4117);
var top_data = map__4117__$1;
var source = cljs.core.get.call(null,map__4117__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
return cljs.core.assoc.call(null,(function (){var G__4122 = phase;
var G__4122__$1 = (((G__4122 instanceof cljs.core.Keyword))?G__4122.fqn:null);
switch (G__4122__$1) {
case "read-source":
var map__4123 = data;
var map__4123__$1 = (((((!((map__4123 == null))))?(((((map__4123.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4123.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4123):map__4123);
var line = cljs.core.get.call(null,map__4123__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.call(null,map__4123__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var G__4125 = cljs.core.merge.call(null,new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.second.call(null,via)),top_data);
var G__4125__$1 = (cljs.core.truth_(source)?cljs.core.assoc.call(null,G__4125,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__4125);
var G__4125__$2 = (cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,source))?cljs.core.dissoc.call(null,G__4125__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__4125__$1);
if(cljs.core.truth_(message)){
return cljs.core.assoc.call(null,G__4125__$2,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__4125__$2;
}

break;
case "compile-syntax-check":
case "compilation":
case "macro-syntax-check":
case "macroexpansion":
var G__4126 = top_data;
var G__4126__$1 = (cljs.core.truth_(source)?cljs.core.assoc.call(null,G__4126,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__4126);
var G__4126__$2 = (cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,source))?cljs.core.dissoc.call(null,G__4126__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__4126__$1);
var G__4126__$3 = (cljs.core.truth_(type)?cljs.core.assoc.call(null,G__4126__$2,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__4126__$2);
var G__4126__$4 = (cljs.core.truth_(message)?cljs.core.assoc.call(null,G__4126__$3,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__4126__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.call(null,G__4126__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__4126__$4;
}

break;
case "read-eval-result":
case "print-eval-result":
var vec__4127 = cljs.core.first.call(null,trace);
var source__$1 = cljs.core.nth.call(null,vec__4127,(0),null);
var method = cljs.core.nth.call(null,vec__4127,(1),null);
var file = cljs.core.nth.call(null,vec__4127,(2),null);
var line = cljs.core.nth.call(null,vec__4127,(3),null);
var G__4130 = top_data;
var G__4130__$1 = (cljs.core.truth_(line)?cljs.core.assoc.call(null,G__4130,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),line):G__4130);
var G__4130__$2 = (cljs.core.truth_(file)?cljs.core.assoc.call(null,G__4130__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file):G__4130__$1);
var G__4130__$3 = (cljs.core.truth_((function (){var and__4115__auto__ = source__$1;
if(cljs.core.truth_(and__4115__auto__)){
return method;
} else {
return and__4115__auto__;
}
})())?cljs.core.assoc.call(null,G__4130__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null))):G__4130__$2);
var G__4130__$4 = (cljs.core.truth_(type)?cljs.core.assoc.call(null,G__4130__$3,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__4130__$3);
if(cljs.core.truth_(message)){
return cljs.core.assoc.call(null,G__4130__$4,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__4130__$4;
}

break;
case "execution":
var vec__4131 = cljs.core.first.call(null,trace);
var source__$1 = cljs.core.nth.call(null,vec__4131,(0),null);
var method = cljs.core.nth.call(null,vec__4131,(1),null);
var file = cljs.core.nth.call(null,vec__4131,(2),null);
var line = cljs.core.nth.call(null,vec__4131,(3),null);
var file__$1 = cljs.core.first.call(null,cljs.core.remove.call(null,(function (p1__4113_SHARP_){
var or__4126__auto__ = (p1__4113_SHARP_ == null);
if(or__4126__auto__){
return or__4126__auto__;
} else {
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,p1__4113_SHARP_);
}
}),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(caller),file], null)));
var err_line = (function (){var or__4126__auto__ = new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(caller);
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return line;
}
})();
var G__4134 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type], null);
var G__4134__$1 = (cljs.core.truth_(err_line)?cljs.core.assoc.call(null,G__4134,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),err_line):G__4134);
var G__4134__$2 = (cljs.core.truth_(message)?cljs.core.assoc.call(null,G__4134__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__4134__$1);
var G__4134__$3 = (cljs.core.truth_((function (){var or__4126__auto__ = fn;
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
var and__4115__auto__ = source__$1;
if(cljs.core.truth_(and__4115__auto__)){
return method;
} else {
return and__4115__auto__;
}
}
})())?cljs.core.assoc.call(null,G__4134__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(function (){var or__4126__auto__ = fn;
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null));
}
})()):G__4134__$2);
var G__4134__$4 = (cljs.core.truth_(file__$1)?cljs.core.assoc.call(null,G__4134__$3,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file__$1):G__4134__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.call(null,G__4134__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__4134__$4;
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__4122__$1)].join('')));

}
})(),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),phase);
});
/**
 * Returns a string from exception data, as produced by ex-triage.
 *   The first line summarizes the exception phase and location.
 *   The subsequent lines describe the cause.
 */
cljs.repl.ex_str = (function cljs$repl$ex_str(p__4138){
var map__4139 = p__4138;
var map__4139__$1 = (((((!((map__4139 == null))))?(((((map__4139.cljs$lang$protocol_mask$partition0$ & (64))) || ((cljs.core.PROTOCOL_SENTINEL === map__4139.cljs$core$ISeq$))))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__4139):map__4139);
var triage_data = map__4139__$1;
var phase = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358));
var source = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
var line = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var symbol = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994));
var class$ = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890));
var cause = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742));
var spec = cljs.core.get.call(null,map__4139__$1,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595));
var loc = [cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__4126__auto__ = source;
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return "<cljs repl>";
}
})()),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__4126__auto__ = line;
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return (1);
}
})()),(cljs.core.truth_(column)?[":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column)].join(''):"")].join('');
var class_name = cljs.core.name.call(null,(function (){var or__4126__auto__ = class$;
if(cljs.core.truth_(or__4126__auto__)){
return or__4126__auto__;
} else {
return "";
}
})());
var simple_class = class_name;
var cause_type = ((cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["RuntimeException",null,"Exception",null], null), null),simple_class))?"":[" (",simple_class,")"].join(''));
var format = goog.string.format;
var G__4141 = phase;
var G__4141__$1 = (((G__4141 instanceof cljs.core.Keyword))?G__4141.fqn:null);
switch (G__4141__$1) {
case "read-source":
return format.call(null,"Syntax error reading source at (%s).\n%s\n",loc,cause);

break;
case "macro-syntax-check":
return format.call(null,"Syntax error macroexpanding %sat (%s).\n%s",(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,(cljs.core.truth_(spec)?(function (){var sb__4667__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__4142_4151 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__4143_4152 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__4144_4153 = true;
var _STAR_print_fn_STAR__temp_val__4145_4154 = (function (x__4668__auto__){
return sb__4667__auto__.append(x__4668__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__4144_4153);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__4145_4154);

try{cljs.spec.alpha.explain_out.call(null,cljs.core.update.call(null,spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.call(null,(function (p1__4136_SHARP_){
return cljs.core.dissoc.call(null,p1__4136_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__4143_4152);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__4142_4151);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__4667__auto__);
})():format.call(null,"%s\n",cause)));

break;
case "macroexpansion":
return format.call(null,"Unexpected error%s macroexpanding %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "compile-syntax-check":
return format.call(null,"Syntax error%s compiling %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "compilation":
return format.call(null,"Unexpected error%s compiling %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "read-eval-result":
return format.call(null,"Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause);

break;
case "print-eval-result":
return format.call(null,"Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause);

break;
case "execution":
if(cljs.core.truth_(spec)){
return format.call(null,"Execution error - invalid arguments to %s at (%s).\n%s",symbol,loc,(function (){var sb__4667__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__4146_4155 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__4147_4156 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__4148_4157 = true;
var _STAR_print_fn_STAR__temp_val__4149_4158 = (function (x__4668__auto__){
return sb__4667__auto__.append(x__4668__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__4148_4157);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__4149_4158);

try{cljs.spec.alpha.explain_out.call(null,cljs.core.update.call(null,spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.call(null,(function (p1__4137_SHARP_){
return cljs.core.dissoc.call(null,p1__4137_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__4147_4156);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__4146_4155);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__4667__auto__);
})());
} else {
return format.call(null,"Execution error%s at %s(%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__4141__$1)].join('')));

}
});
cljs.repl.error__GT_str = (function cljs$repl$error__GT_str(error){
return cljs.repl.ex_str.call(null,cljs.repl.ex_triage.call(null,cljs.repl.Error__GT_map.call(null,error)));
});

//# sourceMappingURL=repl.js.map
