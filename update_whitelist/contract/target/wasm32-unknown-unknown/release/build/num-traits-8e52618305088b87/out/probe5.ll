; ModuleID = 'probe5.ad4db34d-cgu.0'
source_filename = "probe5.ad4db34d-cgu.0"
target datalayout = "e-m:e-p:32:32-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; probe5::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe55probe17h94cdad2535c8d365E() unnamed_addr #0 {
start:
; call core::f64::<impl f64>::is_subnormal
  %_1 = call zeroext i1 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$12is_subnormal17h44a7f9d0b83d67a3E"(double 1.000000e+00) #2
  br label %bb1

bb1:                                              ; preds = %start
  ret void
}

; core::f64::<impl f64>::is_subnormal
; Function Attrs: inlinehint nounwind
define internal zeroext i1 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$12is_subnormal17h44a7f9d0b83d67a3E"(double %self) unnamed_addr #1 {
start:
  %_2 = alloca i8, align 1
  %0 = alloca i8, align 1
; call core::f64::<impl f64>::classify
  %1 = call i8 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$8classify17hab31fdf6cafd4fd7E"(double %self) #2, !range !0
  store i8 %1, i8* %_2, align 1
  br label %bb1

bb1:                                              ; preds = %start
  %2 = load i8, i8* %_2, align 1, !range !0
  %_4 = zext i8 %2 to i32
  %3 = icmp eq i32 %_4, 3
  br i1 %3, label %bb3, label %bb2

bb3:                                              ; preds = %bb1
  store i8 1, i8* %0, align 1
  br label %bb4

bb2:                                              ; preds = %bb1
  store i8 0, i8* %0, align 1
  br label %bb4

bb4:                                              ; preds = %bb3, %bb2
  %4 = load i8, i8* %0, align 1, !range !1
  %5 = trunc i8 %4 to i1
  ret i1 %5
}

; core::f64::<impl f64>::classify
; Function Attrs: nounwind
declare dso_local i8 @"_ZN4core3f6421_$LT$impl$u20$f64$GT$8classify17hab31fdf6cafd4fd7E"(double) unnamed_addr #0

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" }
attributes #2 = { nounwind }

!0 = !{i8 0, i8 5}
!1 = !{i8 0, i8 2}
