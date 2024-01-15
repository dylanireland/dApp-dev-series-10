; ModuleID = 'probe7.514ae878-cgu.0'
source_filename = "probe7.514ae878-cgu.0"
target datalayout = "e-m:e-p:32:32-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; probe7::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe75probe17h9b28fbb472f78ce5E() unnamed_addr #0 {
start:
  %0 = alloca i64, align 8
  %_1 = alloca [8 x i8], align 1
; call core::f64::<impl f64>::to_ne_bytes
  %1 = call i64 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$11to_ne_bytes17h2eb3cf1e495178acE"(double 3.140000e+00) #3
  store i64 %1, i64* %0, align 8
  %2 = bitcast [8 x i8]* %_1 to i8*
  %3 = bitcast i64* %0 to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* align 1 %2, i8* align 8 %3, i32 8, i1 false)
  br label %bb1

bb1:                                              ; preds = %start
  ret void
}

; core::f64::<impl f64>::to_bits
; Function Attrs: inlinehint nounwind
define internal i64 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$7to_bits17h32bb3b105a3d0457E"(double %self) unnamed_addr #1 {
start:
  %0 = alloca i64, align 8
  %1 = bitcast double %self to i64
  store i64 %1, i64* %0, align 8
  %2 = load i64, i64* %0, align 8
  br label %bb1

bb1:                                              ; preds = %start
  ret i64 %2
}

; core::f64::<impl f64>::to_ne_bytes
; Function Attrs: inlinehint nounwind
define internal i64 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$11to_ne_bytes17h2eb3cf1e495178acE"(double %self) unnamed_addr #1 {
start:
  %0 = alloca i64, align 8
  %1 = alloca [8 x i8], align 1
; call core::f64::<impl f64>::to_bits
  %_2 = call i64 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$7to_bits17h32bb3b105a3d0457E"(double %self) #3
  br label %bb1

bb1:                                              ; preds = %start
; call core::num::<impl u64>::to_ne_bytes
  %2 = call i64 @"_ZN4core3num21_$LT$impl$u20$u64$GT$11to_ne_bytes17h89871a44efe32ee9E"(i64 %_2) #3
  store i64 %2, i64* %0, align 8
  %3 = bitcast [8 x i8]* %1 to i8*
  %4 = bitcast i64* %0 to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* align 1 %3, i8* align 8 %4, i32 8, i1 false)
  br label %bb2

bb2:                                              ; preds = %bb1
  %5 = bitcast [8 x i8]* %1 to i64*
  %6 = load i64, i64* %5, align 1
  ret i64 %6
}

; core::num::<impl u64>::to_ne_bytes
; Function Attrs: inlinehint nounwind
define internal i64 @"_ZN4core3num21_$LT$impl$u20$u64$GT$11to_ne_bytes17h89871a44efe32ee9E"(i64 %self) unnamed_addr #1 {
start:
  %0 = alloca [8 x i8], align 1
  %1 = bitcast [8 x i8]* %0 to i64*
  store i64 %self, i64* %1, align 1
  br label %bb1

bb1:                                              ; preds = %start
  %2 = bitcast [8 x i8]* %0 to i64*
  %3 = load i64, i64* %2, align 1
  ret i64 %3
}

; Function Attrs: argmemonly nofree nounwind willreturn
declare void @llvm.memcpy.p0i8.p0i8.i32(i8* noalias nocapture writeonly, i8* noalias nocapture readonly, i32, i1 immarg) #2

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" }
attributes #2 = { argmemonly nofree nounwind willreturn }
attributes #3 = { nounwind }
