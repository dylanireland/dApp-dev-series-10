; ModuleID = 'probe6.d973fac2-cgu.0'
source_filename = "probe6.d973fac2-cgu.0"
target datalayout = "e-m:e-p:32:32-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; probe6::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe65probe17h4f673e1916c04de1E() unnamed_addr #0 {
start:
  %0 = alloca i32, align 4
  %_1 = alloca [4 x i8], align 1
; call core::num::<impl u32>::to_ne_bytes
  %1 = call i32 @"_ZN4core3num21_$LT$impl$u20$u32$GT$11to_ne_bytes17h4d80e4e22d30d6c4E"(i32 1) #3
  store i32 %1, i32* %0, align 4
  %2 = bitcast [4 x i8]* %_1 to i8*
  %3 = bitcast i32* %0 to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* align 1 %2, i8* align 4 %3, i32 4, i1 false)
  br label %bb1

bb1:                                              ; preds = %start
  ret void
}

; core::num::<impl u32>::to_ne_bytes
; Function Attrs: inlinehint nounwind
define internal i32 @"_ZN4core3num21_$LT$impl$u20$u32$GT$11to_ne_bytes17h4d80e4e22d30d6c4E"(i32 %self) unnamed_addr #1 {
start:
  %0 = alloca [4 x i8], align 1
  %1 = bitcast [4 x i8]* %0 to i32*
  store i32 %self, i32* %1, align 1
  br label %bb1

bb1:                                              ; preds = %start
  %2 = bitcast [4 x i8]* %0 to i32*
  %3 = load i32, i32* %2, align 1
  ret i32 %3
}

; Function Attrs: argmemonly nofree nounwind willreturn
declare void @llvm.memcpy.p0i8.p0i8.i32(i8* noalias nocapture writeonly, i8* noalias nocapture readonly, i32, i1 immarg) #2

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" }
attributes #2 = { argmemonly nofree nounwind willreturn }
attributes #3 = { nounwind }
